import Advance from "./Advance";
import Qualityclass from "./Qualityclass";

/**
 * Diese Klasse speichert einen konkreten Verlauf durch die Transformationen
 */
export default class HistoryEntry
{
    public followingEntries = new Array<HistoryEntry>();

    constructor(public  qc_ende:Qualityclass, public a:Advance|undefined, public prob:number, public prob_acc:number, public cost:number, public cost_acc:number, public newQC:boolean = true)
    {

    }
    public isEqual(other: HistoryEntry): boolean {
        
        if (Math.abs(this.cost_acc - other.cost_acc) < 0.001 && Math.abs(this.prob_acc - other.prob_acc) < 0.001){
            return true; 
        }
        return false;
      }
}
//public  qc_start:Qualityclass