import Qualityparam from "./Qualityparameter";

/**
 * Diese Klasse ist eine konkrete Qualitätsinstanz eines Produks beschrieben über eine Liste von Qualitätsmerkmalen und den zugehörigen Auspärgungen
 */
export default class Qualityclass
{
    constructor(public qps: Array<[string, number]>, public cost = 0)
    {

    }
}