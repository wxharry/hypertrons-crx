import { importedFeatures } from './imported-features';
import { FeatureConfigs } from './features.config';

export type HypercrxOptions = typeof defaults;

export const defaults = Object.assign(
  {
    locale: 'en',
  },
  Object.fromEntries([
    ...importedFeatures.map((name) => [
      `hypercrx-${name}` as FeatureId,
      name === 'oss-gpt' ? false : true, // Set oss gpt to disabled by default
    ]),
    ...FeatureConfigs.map((fc) => [fc.id as FeatureId, fc.enabled]),
  ])
);

class OptionsStorage {
  public async getAll(): Promise<HypercrxOptions> {
    return (await browser.storage.sync.get(defaults)) as HypercrxOptions;
  }

  public async set(options: Partial<HypercrxOptions>): Promise<void> {
    await browser.storage.sync.set(options);
  }
}

const optionsStorage = new OptionsStorage();

export default optionsStorage;
