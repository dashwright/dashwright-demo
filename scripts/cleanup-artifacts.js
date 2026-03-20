#!/usr/bin/env node

const { Octokit } = require('@octokit/rest');
require('dotenv').config();

/**
 * Delete GitHub artifacts except the most recent N
 * Usage: node scripts/cleanup-artifacts.js <keep-count> [repo-owner] [repo-name] [token]
 *
 * Environment variables:
 * - GITHUB_TOKEN: GitHub personal access token (required)
 * - GITHUB_REPOSITORY: Repository in format owner/repo (optional, defaults to current repo)
 */

async function cleanupArtifacts() {
  const args = process.argv.slice(2);
  const keepCount = parseInt(args[0]) || 10; // Default to keep 10 most recent artifacts

  // Get repository info from environment or arguments
  const repoArg = args[1] || process.env.GITHUB_REPOSITORY;
  const token = args[3] || process.env.GITHUB_TOKEN;

  if (!token) {
    console.error('❌ Error: GITHUB_TOKEN environment variable is required');
    console.error('   Create a personal access token at: https://github.com/settings/tokens');
    process.exit(1);
  }

  if (!repoArg) {
    console.error('❌ Error: Repository not specified. Use GITHUB_REPOSITORY environment variable or pass as argument');
    process.exit(1);
  }

  const [owner, repo] = repoArg.split('/');
  if (!owner || !repo) {
    console.error('❌ Error: Invalid repository format. Expected: owner/repo');
    process.exit(1);
  }

  const octokit = new Octokit({ auth: token });

  try {
    console.log(`🔍 Fetching artifacts for ${owner}/${repo}...`);

    // Get all artifacts
    const { data: artifacts } = await octokit.actions.listArtifactsForRepo({
      owner,
      repo,
      per_page: 100 // GitHub API limit
    });

    if (artifacts.total_count === 0) {
      console.log('ℹ️  No artifacts found');
      return;
    }

    console.log(`📊 Found ${artifacts.total_count} artifacts`);

    // Sort by creation date (newest first)
    const sortedArtifacts = artifacts.artifacts.sort((a, b) =>
      new Date(b.created_at) - new Date(a.created_at)
    );

    // Keep the most recent N artifacts
    const artifactsToDelete = sortedArtifacts.slice(keepCount);
    const artifactsToKeep = sortedArtifacts.slice(0, keepCount);

    if (artifactsToKeep.length > 0) {
      console.log(`\n✅ Keeping ${artifactsToKeep.length} most recent artifacts:`);
      artifactsToKeep.forEach(artifact => {
        console.log(`   • ${artifact.name} (${new Date(artifact.created_at).toLocaleString()})`);
      });
    }

    if (artifactsToDelete.length === 0) {
      console.log('\nℹ️  No artifacts to delete');
      return;
    }

    console.log(`\n🗑️  Deleting ${artifactsToDelete.length} older artifacts:`);

    // Delete artifacts
    for (const artifact of artifactsToDelete) {
      try {
        console.log(`   • Deleting: ${artifact.name} (${new Date(artifact.created_at).toLocaleString()})`);
        await octokit.actions.deleteArtifact({
          owner,
          repo,
          artifact_id: artifact.id
        });
      } catch (error) {
        console.error(`   ❌ Failed to delete ${artifact.name}: ${error.message}`);
      }
    }

    console.log('\n✅ Cleanup completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the cleanup
cleanupArtifacts();