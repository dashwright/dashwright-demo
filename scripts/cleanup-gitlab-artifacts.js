#!/usr/bin/env node

const axios = require("axios");
require("dotenv").config();

async function cleanupGitLabArtifacts() {
  const args = process.argv.slice(2);
  const keepCount = parseInt(args[0]) || 10;

  // GitLab uses Project IDs or URL-encoded paths (e.g., "group/project")
  const projectId = process.env.CI_PROJECT_ID || process.env.GITLAB_PROJECT_ID;
  const token = process.env.GITLAB_TOKEN;

  if (!token || !projectId) {
    console.error("❌ Error: GITLAB_TOKEN and GITLAB_PROJECT_ID are required.");
    process.exit(1);
  }

  const gitlab = axios.create({
    baseURL: `https://gitlab.com/api/v4/projects/${encodeURIComponent(projectId)}`,
    headers: { "PRIVATE-TOKEN": token },
  });

  try {
    console.log(`🔍 Fetching jobs for project ${projectId}...`);

    // In GitLab, artifacts are attached to JOBS.
    // We list jobs and filter for those with artifacts.
    const { data: jobs } = await gitlab.get("/jobs", {
      params: { per_page: 100, scope: "success" },
    });

    const jobsWithArtifacts = jobs.filter(
      (job) => job.artifacts && job.artifacts.length > 0,
    );

    if (jobsWithArtifacts.length <= keepCount) {
      console.log("✅ No cleanup needed. Artifact count is within limit.");
      return;
    }

    // Sort by created_at (newest first)
    const sortedJobs = jobsWithArtifacts.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );
    const toDelete = sortedJobs.slice(keepCount);

    console.log(`🗑️  Deleting artifacts for ${toDelete.length} old jobs...`);

    for (const job of toDelete) {
      try {
        // GitLab API to specifically delete artifacts from a job
        await gitlab.delete(`/jobs/${job.id}/artifacts`);
        console.log(`   • Deleted artifacts for Job #${job.id} (${job.name})`);
      } catch (err) {
        console.error(`   ❌ Failed Job #${job.id}: ${err.message}`);
      }
    }

    console.log("\n✅ GitLab Artifact Cleanup completed!");
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
  }
}

cleanupGitLabArtifacts();
