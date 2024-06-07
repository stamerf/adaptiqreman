import Advance from "./Advance"
import Qualityclass from "./Qualityclass"
import Qualityparam from "./Qualityparameter";
import Transform from "./Transform";

/**
 * Diese Klasse hilft bei der Erstellung von Aufbereitungsschritten, welche wiederum aus einer Liste von Transformationen bestehen
 */
export default class AdvanceFactory
{
    constructor(private qps: Array<Qualityparam>)
    {

    }
    
    private advance = new Array<Transform>();

    

    /**
     * TODO Verschiedene Varianten der Transformation hinterlegen (addieren, multiplizieren, festlegen)
     * @param prob 
     * @param transform 
     * @param cost 
     */
    public addPossibility(t:Transform)
    {
        if(t.vector.length != this.qps.length)
            throw "Länge nicht gleich"

        //Todo: prüfen, ob transform zulässig ist --> Also keine 0.x auf binary

        this.advance.push(t);
    
    }
    /*
    public generateAdvance(name:string)
    {
        let count = 0;
        this.advance.forEach(element => {
            count +=element.prob;
        });

        if(count != 1)
            throw "Fehler! WKeit nicht 1";


        let res = new Advance(name, this.advance)
        this.advance = new Array<Transform>();

        return res;
    }
    */
    public generateAdvance(name:string, type:string, condition?: Array<Array<number>>)
    {
        let count = 0;
        this.advance.forEach(element => {
            count +=element.prob;
        });

        if(count != 1)
            throw "Fehler! WKeit nicht 1";


        let res = new Advance(name, this.advance, type, condition);
        this.advance = new Array<Transform>();

        return res;
    }
}