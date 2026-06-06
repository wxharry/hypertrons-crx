export type FeatureStage = 'stable' | 'beta' | 'dev';

export type FeatureConfig = {
  id: FeatureId;
  name: string;
  description: string;
  dependency?: FeatureId[]; // Place holder for future use, for features that are within the perceptor tab.
  enabled: boolean;
  stage: FeatureStage; // Place holder for future use, to indicate the development stage of the feature.
};

export const FeatureConfigs: FeatureConfig[] = [
  {
    id: 'hypercrx-developer-activity-openrank-trends',
    name: 'Developer Activity OpenRank Trends',
    description: 'Show the trends of developer activity and OpenRank.',
    enabled: true,
    stage: 'stable',
  },
  {
    id: 'hypercrx-developer-networks',
    name: 'Developer Networks',
    description: 'Show developer networks in GitHub profile.',
    enabled: true,
    stage: 'stable',
  },
  {
    id: 'hypercrx-developer-hovercard-info',
    name: 'Developer Hovercard Info',
    description: 'Show developer info in hovercard.',
    enabled: true,
    stage: 'stable',
  },
];

/**
 * Check if a feature is enabled in browser storage.
 * Falls back to matching keys that start with featureId (for legacy feature names).
 * Defaults to enabled if no matching key is found.
 */
export async function isFeatureEnabled(featureId: FeatureId): Promise<boolean> {
  const { default: optionsStorage } = await import('./options-storage');
  const options = await optionsStorage.getAll();
  let enabled = (options as any)[featureId];

  if (typeof enabled === 'undefined') {
    const matchKey = Object.keys(options).find((k) => k.startsWith(featureId));
    enabled = matchKey ? (options as any)[matchKey] : true;
  }

  return enabled;
}
