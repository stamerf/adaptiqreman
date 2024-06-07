import Qualityclass from "./Qualityclass";

/**
 * Diese Klasse gibt eine konkrete Transformation von einer Klasse in eine andere an
 */
export default class Transform
{
    constructor(public prob: number, public vector: Array<number>, public cost: number)
    {

    }

    public transform(qc: Qualityclass, type: string, condition?: Array<Array<number>>): Qualityclass
    {
        let help = new Qualityclass(Array.from(JSON.parse(JSON.stringify(qc.qps))));
        //Prüfen, ob mind. 1 Qualiparameter echt besser ist durch Transformation --> simultane Verschlechterungen eines anderen Parameters dadurch mögl.
        let res = new Qualityclass(Array.from(JSON.parse(JSON.stringify(qc.qps))));
        let count = 0;

        for (let index = 0; index < qc.qps.length; index++)
        {
            if (this.vector[index] != -1)
            {
                if (type == "add" && qc.qps[index][1] + this.vector[index] <= 1) //überlegen, ob sinnvoller, wenn anwendbar, aber dann auf 1 abrunden
                {
                    help.qps[index][1] = parseFloat((qc.qps[index][1] + this.vector[index]).toPrecision(4));

                    if (parseFloat((qc.qps[index][1] + this.vector[index]).toPrecision(4)) > qc.qps[index][1])
                    {
                        count = count + 1;
                    }
                }
                else if (type == "multiply" && qc.qps[index][1] * (1 + this.vector[index]) <= 1)
                {
                    help.qps[index][1] = parseFloat((qc.qps[index][1] * (1 + this.vector[index])).toPrecision(4));

                    if (parseFloat((qc.qps[index][1] * (1 + this.vector[index])).toPrecision(4)) > qc.qps[index][1])
                    {
                        count = count + 1;
                    }
                }
                else if (type == "replace" && this.vector[index] <= 1)
                {
                    help.qps[index][1] = this.vector[index];

                    if (this.vector[index] > qc.qps[index][1])
                    {
                        count = count + 1;
                    }
                }
            }
        }

        let count2 = 0;

        //for (let j = 0; j < 2; j++)
        // pass 2 values: first for minimum parameter values & second for maximal parameter values
        for (let i = 0; i < qc.qps.length; i++)
        {
            if (condition && condition[0][i] <= help.qps[i][1] && condition[1][i] >= help.qps[i][1])
            {
                count2 = count2 + 1;
            }
        }


        if (condition && count > 0 && count2 == qc.qps.length)
        {
            res = help;
        }

        else if (!condition && count > 0)
        {
            res = help;
        }
        else
        {
            res = qc;
        }
        return res;
    }
}


/*
public transform_replace(qc: Qualityclass): Qualityclass
{
    let res = new Qualityclass(Array.from(JSON.parse(JSON.stringify(qc.qps))));
    //Axchtung: unklar ob hier byval oder byref ist; könnte problematisch sein
    for (let index = 0; index < qc.qps.length; index++)
    {
        if (this.vector[index] != -1)
        {
            res.qps[index][1] = this.vector[index];
        }
    }

    return res;

}

public transform_add(qc: Qualityclass): Qualityclass
{
    let res = new Qualityclass(Array.from(JSON.parse(JSON.stringify(qc.qps))));
    for (let index = 0; index < qc.qps.length; index++)
    {
        if (this.vector[index] != -1)
        {
            res.qps[index][1] = qc.qps[index][1] + this.vector[index];
        }
    }

    return res;
}

public transform_multiply(qc: Qualityclass): Qualityclass
{
    let res = new Qualityclass(Array.from(JSON.parse(JSON.stringify(qc.qps))));
    for (let index = 0; index < qc.qps.length; index++)
    {
        if (this.vector[index] != -1)
        {
            res.qps[index][1] = qc.qps[index][1] * (1 + this.vector[index]);
        }
    }

    return res;
}
*/

