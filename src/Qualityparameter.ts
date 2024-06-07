/**
 * Definiert ein Qualitätsmerkmal. Es besteht aus dem Namen und dem Datentyp
 */
export default class Qualityparam
{
    /**
     * 
     * @param name Name des Parameters
     * @param type Typ des Parameters - wichtig für spätere logik-prüfungen
     */
    constructor(public name:string, public type:"binary"|"integer"|"float")
    {

    }

}