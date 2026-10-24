import { describe, expect, it } from "vitest";
import { seedProjects } from "../../data/seedProjects";
import { filterAndSortProjects } from "./projectFilters";

describe("filterAndSortProjects", () => {
  it("searches names, descriptions, and technologies without case sensitivity", () => {
    const byName = filterAndSortProjects(seedProjects, { query: "echo", status: "all", reason: "all", sort: "recent-activity" });
    const byDescription = filterAndSortProjects(seedProjects, { query: "recipe planner", status: "all", reason: "all", sort: "recent-activity" });
    const byTechnology = filterAndSortProjects(seedProjects, { query: "OPENTYPE.JS", status: "all", reason: "all", sort: "recent-activity" });
    expect(byName.map((project) => project.id)).toContain("demo-echo-garden");
    expect(byDescription.map((project) => project.id)).toContain("demo-pocket-pantry");
    expect(byTechnology.map((project) => project.id)).toContain("demo-glyph-lab");
  });

  it("combines status and abandonment-reason filters", () => {
    const result = filterAndSortProjects(seedProjects, { query: "", status: "paused", reason: "technical-blocker", sort: "recent-activity" });
    expect(result.map((project) => project.id)).toEqual(["demo-glyph-lab"]);
  });

  it("sorts by activity and both creation-date directions", () => {
    const recent = filterAndSortProjects(seedProjects, { query: "", status: "all", reason: "all", sort: "recent-activity" });
    const newest = filterAndSortProjects(seedProjects, { query: "", status: "all", reason: "all", sort: "newest-created" });
    const oldest = filterAndSortProjects(seedProjects, { query: "", status: "all", reason: "all", sort: "oldest-created" });
    expect(recent[0].id).toBe("demo-pocket-pantry");
    expect(newest[0].id).toBe("demo-glyph-lab");
    expect(oldest[0].id).toBe("demo-nightshift-notes");
  });
});
