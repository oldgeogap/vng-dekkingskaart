import electron from "electron";
import * as React from "react";
import { ipcEvents } from "../../shared";

const ipcRenderer = electron.ipcRenderer || false;

export interface UseLoadFileReturn {
  loading: boolean;
  error: string | null;
  data: any;
}

export type Job = {
  task: () => void;
  resolve: (data: any) => void;
  reject: (msg: string) => void;
};

const _jobs: Job[] = [];
let _job: Job | null = null;

if (ipcRenderer) {
  ipcRenderer.on(ipcEvents.LOAD_FILE_RESULT, onLoadResult);
  ipcRenderer.on(ipcEvents.LOAD_FILE_ERROR, onLoadError);
}

function onLoadResult(event, data) {
  if (_job) {
    _job.resolve(data);
  }
  processJobs();
}

function onLoadError(event, msg) {
  console.log("Job Onload error");
  if (_job) {
    _job.reject(msg);
  }
  processJobs();
}

function addJob(job: Job) {
  if (_job === null) {
    console.log("Adding job and starting");
    _job = job;
    _job.task();
  } else {
    console.log("Queuing job");
    _jobs.push(job);
  }
}

function processJobs() {
  console.log("processing jobs");
  if (_jobs.length) {
    console.log("New job");
    _job = _jobs.shift();
    _job.task();
  } else {
    console.log("Done");
    _job = null;
  }
}

async function loadFile(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let job: Job = {
      task: () => {
        if (ipcRenderer) {
          ipcRenderer.send(ipcEvents.LOAD_FILE, path);
        }
      },
      resolve,
      reject
    };
    addJob(job);
  });
}

export function useLoadFile(path: string, json?: boolean) {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const action = async () => {
      try {
        const result = await loadFile(path);

        setData(json ? JSON.parse(result) : result);
      } catch (e) {
        setError(e);
      }
    };
    action();
  }, []);

  return {
    loading: data === null && error === null,
    error,
    data
  };
}
