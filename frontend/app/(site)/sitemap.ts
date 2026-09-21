import type { MetadataRoute } from "next";
import { apiGet } from "@/lib/api";
import { absoluteUrl } from "@/lib/site";
import type { ConstructionProject, DesignWork, Project } from "@/lib/types";

const STATIC_PATHS = [
  "/",
  "/services",
  "/projects",
  "/construction-projects",
  "/design",
  "/team",
  "/testimonials",
  "/social",
  "/cost-estimator",
  "/contact",
];

/** A backend hiccup must not fail the whole sitemap — fall back to no entries
 * for that section and still serve the static routes. */
async function safeGet<T>(path: string): Promise<T[]> {
  try {
    return await apiGet<T[]>(path);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, constructionProjects, designWorks] = await Promise.all([
    safeGet<Project>("/api/projects"),
    safeGet<ConstructionProject>("/api/construction-projects"),
    safeGet<DesignWork>("/api/design-works"),
  ]);

  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));

  for (const project of projects.filter((p) => p.published)) {
    entries.push({
      url: absoluteUrl(`/projects/${project.slug}`),
      lastModified: new Date(project.updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const project of constructionProjects.filter((p) => p.published)) {
    entries.push({
      url: absoluteUrl(`/construction-projects/${project.slug}`),
      lastModified: new Date(project.updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  const published = designWorks.filter((w) => w.published);
  const kinds = new Set<string>();
  const scopes = new Set<string>();

  for (const work of published) {
    kinds.add(work.kind);
    scopes.add(`${work.kind}/${work.scope}`);
    entries.push({
      url: absoluteUrl(`/design/${work.kind}/${work.scope}/${work.slug}`),
      lastModified: new Date(work.updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const kind of kinds) {
    entries.push({ url: absoluteUrl(`/design/${kind}`), changeFrequency: "monthly", priority: 0.6 });
  }
  for (const scope of scopes) {
    entries.push({ url: absoluteUrl(`/design/${scope}`), changeFrequency: "monthly", priority: 0.6 });
  }

  return entries;
}
