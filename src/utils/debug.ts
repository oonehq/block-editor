import debug from "debug"

export const logger = debug("editor")
logger.log = console.log.bind(console)
