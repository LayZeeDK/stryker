import { expect } from 'chai';

import { declareClassPlugin, declareFactoryPlugin } from '../../../src/plugin/plugins';
import { PluginKind } from '../../../src/plugin/plugin-kind';
import { tokens, commonTokens } from '../../../src/plugin/tokens';
import { Logger } from '../../../logging';
import { MutantResult } from '../../../report';

describe('plugins', () => {
  describe(declareClassPlugin.name, () => {
    it('should declare a class plugin', () => {
      class MyReporter {
        constructor(private readonly log: Logger) {}
        public static inject = tokens(commonTokens.logger);

        public onMutantTested(result: MutantResult) {
          this.log.info(JSON.stringify(result));
        }
      }
      expect(declareClassPlugin(PluginKind.Reporter, 'rep', MyReporter)).deep.eq({
        injectableClass: MyReporter,
        kind: PluginKind.Reporter,
        name: 'rep',
      });
    });
  });

  describe(declareFactoryPlugin.name, () => {
    it('should declare a factory plugin', () => {
      function createReporter(log: Logger) {
        return {
          onMutantTested(result: MutantResult) {
            log.info(JSON.stringify(result));
          },
        };
      }
      createReporter.inject = tokens(commonTokens.logger);

      expect(declareFactoryPlugin(PluginKind.Reporter, 'rep', createReporter)).deep.eq({
        factory: createReporter,
        kind: PluginKind.Reporter,
        name: 'rep',
      });
    });
  });
});
