import HistoryEntry from "./HistoryEntry";
import QualityClassFactory from "./QualityClassFactory";
import Qualityclass from "./Qualityclass";
import Qualityparam from "./Qualityparameter";
import Transform from "./Transform";

/**
 * Diese Klasse ist eine Gruppe von Transformationen. Die WKeit über alle Transformationen muss 1 ergeben, also 100%
 */
export default class Advance
{

    constructor(public name, public transform: Array<Transform>, public type:string, public condition?: Array<Array<number>>)
    {        
        
    }

    public apply(qc:Qualityclass):Array<HistoryEntry>
    {
        let res = new Array<HistoryEntry>();
        this.transform.forEach(element =>{
            //qc.qps.values
            let h = new HistoryEntry(element.transform(qc, this.type, this.condition), this, element.prob, element.prob, element.cost, element.cost);
            res.push(h)
        })
        return res;
    }

    /*
    public apply2(qc:Qualityclass):Array<HistoryEntry>
    {
        let res = new Array<HistoryEntry>();
        this.transform.forEach(element =>{
            //qc.qps.values
            let h = new HistoryEntry(qc, element.transform_add(qc), this, element.prob, element.prob, element.cost, element.cost);
            res.push(h)
        })
        return res;
    */
}