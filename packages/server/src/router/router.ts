import { artifactsRouter } from './router.artifacts.js';
import { loadsRouter } from './router.loads.js';
import { logsRouter } from './router.logs.js';
import { runsRouter } from './router.runs.js';
import { secretsRouter } from './router.secrets.js';
import { router } from './router.utils.js';

const rootRouter = router({
  loads: loadsRouter,
  runs: runsRouter,
  logs: logsRouter,
  artifacts: artifactsRouter,
  secrets: secretsRouter,
});

type RootRouter = typeof rootRouter;

export type { RootRouter };
export { rootRouter };
