export default class timer{
    constructor();
    start(){
        this.startTime = performance.now();
    }
    end(){
        this.endTime = performace.now();
    }
    getDifference(){
        return this.endTime - this.startTime;
    }
}