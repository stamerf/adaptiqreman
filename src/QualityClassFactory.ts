import Qualityclass from "./Qualityclass";
import Qualityparam from "./Qualityparameter";

/**
 * Diese Klasse hilft bei der Generierung von Qualitätsklassen
 */
export default class QualityClassFactory
{
    constructor(private qps: Array<Qualityparam>)
    {

    }
    public i: number = 1;

    public createQC(val: Array<number>)
    {
        let ar = new Array<[string, number]>();


        if (val.length != this.qps.length)
            throw "Fehler";


        for (let index = 0; index < this.qps.length; index++)
        {
            const element = this.qps[index];
            ar.push([element.name, (val[index] as any)]);
        }

        let qc = new Qualityclass(ar);

        //console.log("Class " + this.i + ": " + qc.qps);

        this.i = this.i + 1;

        return qc;
    }
}


/*
//qParams.push(new Qualityparam("Semiconductor_function", "binary"), new Qualityparam("Semiconductor_lifetime", "binary"), new Qualityparam("Charching_Circuit_function", "binary"), new Qualityparam("Charching_Circuit_lifetime", "binary"), new Qualityparam("Control_Board_function", "binary"), new Qualityparam("Control_Board_lifetime", "binary"), new Qualityparam("Fan_function", "binary"), new Qualityparam("Fan_lifetime", "binary"), new Qualityparam("Software", "binary"));

a_factory.addPossibility(new Transform(0.8, [0.5, 0.5, 0.5, -1, -1, 1, -1], 38));
a_factory.addPossibility(new Transform(0.2, [-1, -1, -1, -1, -1, -1, -1], 38));
a_set.push(a_factory.generateAdvance("Replace Housing & Power Unit with Used One (+ Parameter Reset)", "replace"));

a_factory.addPossibility(new Transform(0.9, [-1, -1, -1, 1, -1, 1, -1], 40));
a_factory.addPossibility(new Transform(0.1, [-1, -1, -1, 0, -1, -1, -1], 40));
a_set.push(a_factory.generateAdvance("Replace Control Board with New One (+ Parameter Reset)", "replace", [[0.5, 0.5, 0.5, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1]]));

a_factory.addPossibility(new Transform(0.8, [-1, -1, -1, 0.5, -1, 1, -1], 27));
a_factory.addPossibility(new Transform(0.2, [-1, -1, -1, 0, -1, -1, -1], 27));
a_set.push(a_factory.generateAdvance("Replace Control Board with Used One (+ Parameter Reset)", "replace", [[0.5, 0.5, 0.5, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1]]));

a_factory.addPossibility(new Transform(0.9, [-1, -1, -1, -1, 1, -1, -1], 14));
a_factory.addPossibility(new Transform(0.1, [-1, -1, -1, -1, 0, -1, -1], 14));
a_set.push(a_factory.generateAdvance("Replace Fan with New One", "replace", [[0.5, 0, 0, 0, 0, 0, 0],  [1, 1, 1, 1, 1, 1, 1]]));

a_factory.addPossibility(new Transform(0.8, [-1, -1, -1, -1, 0.5, -1, -1], 5));
a_factory.addPossibility(new Transform(0.2, [-1, -1, -1, -1, 0, -1, -1], 5));
a_set.push(a_factory.generateAdvance("Replace Fan with Used One", "replace", [[0.5, 0, 0, 0, 0, 0, 0],  [1, 1, 1, 1, 1, 1, 1]]));

a_factory.addPossibility(new Transform(0.9, [-1, -1, -1, -1, -1, 1, -1], 2));
a_factory.addPossibility(new Transform(0.1, [-1, -1, -1, -1, -1, 0, -1], 2));
a_set.push(a_factory.generateAdvance("Parameter Reset", "replace", [[0.5, 0.5, 0.5, 0.5, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1]])); //only possible, when power unit & control are funtioning
//third parameter is an array of miniumum parameter values (first array within array) & maximum (second array within array) parameter values

a_factory.addPossibility(new Transform(0.9, [-1, -1, -1, -1, -1, -1, 1], 4));
a_factory.addPossibility(new Transform(0.1, [-1, -1, -1, -1, -1, -1, 0], 4));
a_set.push(a_factory.generateAdvance("Software Update", "replace", [[0.5, 0.5, 0.5, 0.5, 0, 1, 0], [1, 1, 1, 1, 1, 1, 1]]));

*/