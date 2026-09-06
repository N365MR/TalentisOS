import { ROADMAP_ID, STORE_NAMES, createRoadmapRecord, nowIso } from './schema.js';
import { createRecord, getRecord, updateRecord } from './storage.js';

export function roadmapProgress(roadmap) {
  const milestones = roadmap?.milestones || [];
  const completed = milestones.filter(milestone => milestone.status === 'completed').length;
  return { total: milestones.length, completed, percent: milestones.length ? Math.round(completed / milestones.length * 100) : 0 };
}
export function nextBestAction(roadmap) { return roadmap?.milestones?.find(milestone => milestone.status !== 'completed') || null; }
export function stageProgress(roadmap, stage) { const milestones = (roadmap?.milestones || []).filter(milestone => milestone.stage === stage); return { total: milestones.length, completed: milestones.filter(milestone => milestone.status === 'completed').length }; }
export async function getLeadershipRoadmap() {
  const existing = await getRecord(STORE_NAMES.roadmap, ROADMAP_ID);
  if (existing) return existing;
  const record = createRoadmapRecord();
  try { return await createRecord(STORE_NAMES.roadmap, record); } catch (error) { const concurrent = await getRecord(STORE_NAMES.roadmap, ROADMAP_ID); if (concurrent) return concurrent; throw error; }
}
export async function setMilestoneCompleted(id, completed) {
  const roadmap = await getLeadershipRoadmap();
  if (!roadmap.milestones.some(milestone => milestone.id === id)) throw new TypeError('That roadmap milestone is unavailable.');
  const timestamp = nowIso();
  const milestones = roadmap.milestones.map(milestone => milestone.id === id ? { ...milestone, status: completed ? 'completed' : 'not-started', completedAt: completed ? timestamp : null } : milestone);
  return updateRecord(STORE_NAMES.roadmap, { ...roadmap, milestones });
}
