import Advance from "./Advance";
import AdvanceFactory from "./AdvanceFactory";
import HistoryEntry from "./HistoryEntry";
import QualityClassFactory from "./QualityClassFactory";
import Qualityclass from "./Qualityclass";
import Qualityparam from "./Qualityparameter";
import Transform from "./Transform";
import Functions from "./Functions";
import OrderManagement from "./OrderManagement";
import { performance, PerformanceObserver } from "perf_hooks";
import * as ExcelJS from 'exceljs';
import * as path from 'path';


console.log("start")
performance.mark("gesamt-start")

/**
 * Define all quality parameters that are to be considered
 */
let qParams = new Array<Qualityparam>();
qParams.push(new Qualityparam("Housing", "float"), new Qualityparam("Semiconductor_function", "binary"), new Qualityparam("Semiconductor_lifecycle", "binary"), new Qualityparam("Charging_Circuit_function", "binary"), new Qualityparam("Charging_Circuit_lifecycle", "binary"), new Qualityparam("Control_Board_function", "binary"), new Qualityparam("Control_Board_lifecycle", "binary"), new Qualityparam("Fan_function", "binary"), new Qualityparam("Fan_lifecycle", "binary"), new Qualityparam("Parameter_Setting", "binary"), new Qualityparam("Software_Version", "binary"));

let qValues: number[][] = [
    [0, 0.5, 1],
    [0, 1],
    [0],
    [0, 1],
    [0],
    [0, 1],
    [0],
    [0, 1],
    [0],
    [0, 1],
    [0, 1],
]

/**
 * Define all possible quality classes of cores (from which we start)
 */
let factory = new QualityClassFactory(qParams);

let qClasses = new Array<Qualityclass>();
let functions = new Functions();

let qClasses1 = functions.getAllRowCombinations(qValues);

for (let index = 0; index < qClasses1!.length; index++)
{
    qClasses.push(factory.createQC(qClasses1![index]))
}

//Create a set of processing setps
let a_factory = new AdvanceFactory(qParams);
/**
 * Set of available processing steps
 */
let a_set = new Array<Advance>();

// Define all possible transformations for each processing step with the corresponding probabilities, transformations of each single quality parameter and the related costs 
//-1 indicates that the current parameter value is not affected/changed by the transformation

a_factory.addPossibility(new Transform(0.9, [0.5, 1, 0, 1, 0, -1, -1, -1, -1, 1, -1], 40));
a_factory.addPossibility(new Transform(0.1, [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], 40));
a_set.push(a_factory.generateAdvance("Step1", "replace"));

a_factory.addPossibility(new Transform(0.95, [-1, -1, -1, -1, -1, 1, 1, -1, -1, 1, -1], 69));
a_factory.addPossibility(new Transform(0.05, [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], 69));
a_set.push(a_factory.generateAdvance("Step2", "replace", [[0.5, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]));

a_factory.addPossibility(new Transform(0.9, [-1, -1, -1, -1, -1, 1, 0, -1, -1, 1, -1], 28));
a_factory.addPossibility(new Transform(0.1, [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], 28));
a_set.push(a_factory.generateAdvance("Step3", "replace",  [[0.5, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]));

a_factory.addPossibility(new Transform(0.95, [-1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1], 18));
a_factory.addPossibility(new Transform(0.05, [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], 18));
a_set.push(a_factory.generateAdvance("Step4", "replace", [[0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]));

a_factory.addPossibility(new Transform(0.9, [-1, -1, -1, -1, -1, -1, -1, 1, 0, -1, -1], 5));
a_factory.addPossibility(new Transform(0.1, [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], 5));
a_set.push(a_factory.generateAdvance("Step5", "replace", [[0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]));

a_factory.addPossibility(new Transform(0.99, [-1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1], 2));
a_factory.addPossibility(new Transform(0.01, [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], 2));
a_set.push(a_factory.generateAdvance("Step6", "replace", [[0.5, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]));
//third parameter is an array of miniumum parameter values (first array within array) & maximum (second array within array) parameter values

a_factory.addPossibility(new Transform(0.99, [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1], 3));
a_factory.addPossibility(new Transform(0.01, [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], 3));
a_set.push(a_factory.generateAdvance("Step7", "replace", [[0.5, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]));

let solution = new Map<Qualityclass, Map<Qualityclass, Array<Array<HistoryEntry>>>>();

qClasses.forEach(element =>
{
    let history = new Array<HistoryEntry>();
    history.push(new HistoryEntry(element, undefined, 1, 1, 0, 0));
    let histories = new Array<Array<HistoryEntry>>();
    histories.push(history); //Starting condition: First entry from which we start
    do
    {
        let history = histories[histories.length - 1];

        if (histories.length > 0)
        {
            histories.length = histories.length - 1;
        }

        let res = functions.solved(solution, a_set, history);
        //check for prune (all following qc already exist in history)
        let numberOfNew: number = 0;

        history[history.length - 1].followingEntries.forEach(element =>
        {
            if (element.newQC == true)
            {
                numberOfNew += 1;
            }
        });
        if (numberOfNew > 0)
            res.forEach(ele =>
            {
                if (ele[ele.length - 1].newQC) //only push if qc is new
                {
                    histories = [...histories, ele];
                }
            });
        //Global pruning

    } while (histories.length != 0);
});


/**
 * Display results on console
 */
//functions.print(solution);


//Create excel look-up table
let workbook = new ExcelJS.Workbook();
let worksheet = workbook.addWorksheet('Look-Up-Table');

functions.generateLookUpTable(solution, worksheet);


//Get all attainable qc from a predefined storage of cores
let workbook1 = new ExcelJS.Workbook();

//define classes that are demanded and what is available in store of cores
let demand = [factory.createQC([0.5, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1]), factory.createQC([0.5, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]), factory.createQC([0.5, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1])];
let storage = [factory.createQC([0.5, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1]), factory.createQC([0.5, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1]), factory.createQC([0.5, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1]), factory.createQC([0.5, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0])];

//define the minimal acceptable reliabilty of process plan (for each feasible solution)
let min_reliability = 0.8;

let res = functions.generateExelAttainableQC(solution, demand, storage, min_reliability, workbook1);

//Order management MILP: get cost minimal process plan for fulfilling the demand with the available cores in storage
let order_man = new OrderManagement();
order_man.order_management(res[1], demand, storage, workbook1);


// Generate the Excel file
let storageLocation = path.join(".", "Excel files");
let excelFileName = 'Remanufacturing_Look_Up_Table.xlsx';
workbook.xlsx.writeFile(path.join(storageLocation, excelFileName))
    .then(() =>
    {
        console.log(`Excel file "${excelFileName}" created successfully.`);
    })
    .catch((error) =>
    {
        console.error('Error creating Excel file:', error);
    });

const storageLocation1 = path.join(".", "Excel files");
const excelFileName1 = 'Order Management.xlsx';
workbook1.xlsx.writeFile(path.join(storageLocation1, excelFileName1))
    .then(() =>
    {
        console.log(`Excel file "${excelFileName1}" created successfully.`);
    })
    .catch((error) =>
    {
        console.error('Error creating Excel file:', error);
    });



performance.mark("gesamt-end")
performance.measure("gesamt", "gesamt-start", "gesamt-end")

performance.getEntriesByName("gesamt").forEach(a =>
{
    console.log(a.duration);
})

console.log("finish");