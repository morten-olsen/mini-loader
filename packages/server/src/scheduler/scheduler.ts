import { CronJob } from 'cron';
import { ScheduleRepo } from '../repos/schedules/schedules.js';
import { RunRepo } from '../repos/runs/runs.js';

type SchedulerOptions = {
  runs: RunRepo;
  schedules: ScheduleRepo;
};

type RunningSchedule = {
  id: string;
  job: CronJob;
  stop: () => Promise<void>;
};

class Scheduler {
  #running: RunningSchedule[] = [];
  #options: SchedulerOptions;

  constructor(options: SchedulerOptions) {
    this.#options = options;
    const { schedules } = this.#options;
    schedules.on('added', this.#add);
    schedules.on('removed', this.#remove);
  }

  #remove = async (id: string) => {
    const current = this.#running.filter((r) => r.id === id);
    await Promise.all(current.map((r) => r.stop()));
    this.#running = this.#running.filter((r) => r.id !== id);
  };

  #add = async (id: string) => {
    const { schedules, runs } = this.#options;
    const current = this.#running.filter((r) => r.id === id);
    await Promise.all(current.map((r) => r.stop()));
    const schedule = await schedules.get(id);
    if (!schedule) {
      return;
    }
    const job = new CronJob(schedule.cron, async () => {
      await runs.create({
        loadId: schedule.load,
      });
    });
    const stop = async () => {
      job.stop();
    };
    this.#running.push({
      id: schedule.id,
      job,
      stop,
    });
  };

  public stop = async () => {
    for (const running of this.#running) {
      await running.stop();
      this.#running = this.#running.filter((r) => r !== running);
    }
  };

  public start = async () => {
    const { schedules } = this.#options;
    await this.stop();
    const all = await schedules.find({});
    for (const schedule of all) {
      await this.#add(schedule.id);
    }
  };
}

export { Scheduler };
