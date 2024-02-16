export default class ProcessManagerService {
    constructor();
    start(id: string): Promise<void>;
    restart(id: string): Promise<void>;
}
