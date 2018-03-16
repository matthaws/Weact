export const HOST = "HOST";
export const CLASS = "CLASS";
export const ROOT = "ROOT";

const updateQueue = [];
let nextUnitOfWork = null;
let pendingCommit = null;
