import Advance from "./Advance";
import HistoryEntry from "./HistoryEntry";
import Qualityclass from "./Qualityclass";
import OrderManagement from "./OrderManagement";
import * as ExcelJS from 'exceljs';

export default class Functions
{
    constructor()
    {
    }

    public getAllRowCombinations(arr: number[][], currentIndex: number = 0, currentCombination: number[] = [], result: number[][] = [])
    {
        if (currentIndex === arr.length)
        {
            // Base case: If currentIndex reaches the length of the array, add the current combination to the result.
            result.push([...currentCombination]);
            return;
        }

        for (let i = 0; i < arr[currentIndex].length; i++)
        {
            currentCombination.push(arr[currentIndex][i]);
            // Recursively generate combinations for the next row in the array
            this.getAllRowCombinations(arr, currentIndex + 1, currentCombination, result);
            // Backtrack to remove the last element and try the next one
            currentCombination.pop();
        }

        return result;
    }

    public compareArrays(ar1, ar2)
    {
        // Überprüfen, ob beide Hashmaps die gleiche Anzahl von Schlüsseln haben
        if (ar1.length !== ar2.length)
        {
            return false;
        }
        //Prüfen, ob Abstand zweier qc mind. größer Grenzwert ist
        for (let index = 0; index < ar1.length; index++)
        {
            if (Math.abs(ar1[index][1] - ar2[index][1]) > 0.0000001)
            {
                return false;
            }
        }
        return true;
    }

    public arraysHaveSameElements(array1: String[], array2: String[]): boolean
    {
        // Check if the arrays have the same length
        if (array1.length !== array2.length)
        {
            return false;
        }

        // Create copies and sort arrays
        const sortedArray1 = array1.slice().sort();
        const sortedArray2 = array2.slice().sort();

        // Compare the sorted arrays element by element
        for (let i = 0; i < sortedArray1.length; i++)
        {
            if (sortedArray1[i] !== sortedArray2[i])
            {
                return false;
            }
        }
        // If all elements match, the arrays have the same elements
        return true;
    }

    /**
     * Function evaluates all Pareto-optimal combinations of processing steps by checking if the application of the 
     * processing steps in a_set results in a quality improvement or if it can be attained under Pareto-optimal conditions
     * (if the attainable qc has already been reached by applying other combination of process steps)
     */
    public solved(solution: Map<Qualityclass, Map<Qualityclass, Array<Array<HistoryEntry>>>>, a_set: Array<Advance>, history: Array<HistoryEntry> = new Array()): Array<Array<HistoryEntry>>
    {
        let histories = new Array<Array<HistoryEntry>>();

        a_set.forEach(a =>
        {
            let historyStep = new Array<HistoryEntry>();

            historyStep.push(...a.apply(history[history.length - 1].qc_ende));

            //Check if all qClasses have already been considered 
            let ar = solution.get(history[0].qc_ende);

            historyStep.forEach(historyEntry =>
            {
                /**
                 * Defines the new history which we obtain after applying an advance a (previous history extended by historyEntry)
                 */
                let new_history = new Array<HistoryEntry>();
                new_history.push(...history);

                historyEntry.prob_acc = parseFloat((history[history.length - 1].prob_acc * historyEntry.prob).toPrecision(4)); //accumulated
                historyEntry.cost_acc = parseFloat((history[history.length - 1].cost_acc + historyEntry.cost).toPrecision(4)); //accumulated

                new_history[new_history.length - 1].followingEntries.push(historyEntry);
                new_history.push(historyEntry);

                //Check if qc is new in history --> path specific 
                for (let index = 0; index < new_history.length - 1; index++)
                {
                    const ele2 = new_history[index].qc_ende;
                    //new qc? --> compare qc of each entry of new_history with qc of the new (last) historyEntry 
                    if (this.compareArrays(historyEntry.qc_ende.qps, ele2.qps))
                    {
                        historyEntry.newQC = false;
                        break;
                    }

                    //qc of history[0] not defined yet --> create new Map entry for this qc of core (to start from)
                    if (ar == undefined) 
                    {
                        solution.set(history[0].qc_ende, new Map<Qualityclass, Array<Array<HistoryEntry>>>())
                        solution.get(history[0].qc_ende)!.set(historyEntry.qc_ende, [new_history]);
                        histories.push(new_history);
                    }
                    else
                    {
                        let ar2: Qualityclass | undefined = undefined;
                        let ar3: Array<Array<HistoryEntry>> | undefined = undefined;

                        ar.forEach((val, key) =>
                        {
                            //qc already attained? 
                            if (this.compareArrays(key.qps, historyEntry.qc_ende.qps))
                            {
                                ar2 = key;
                                ar3 = val;
                            }
                        })
                        // qc_ende of historyEntry not yet attained --> define new-history as process alternative for obtaining qc_ende of historyEntry
                        if (ar2 == undefined)
                        {
                            ar.set(historyEntry.qc_ende, [new_history]);
                            histories.push(new_history);
                        }
                        /*qc_ende of historyEntry already obtained --> distinction between various cases: 
                         1. qc_ende obtained under better conditions (lower costs and equal/higher probability OR equal/lower costs and higher probability)
                            --> replace current Pareto-optimal alternatives
                         2. qc_ende already obtained under Pareto-optimal conditions (lower costs OR higher probability)
                            --> extend current set of Pareto-optimal alternatives by additional process alternative
                         */
                        else 
                        {
                            /**
                             * Defines all Pareto-optimal alternatives for a specific qc of cores (starting points)
                             */
                            let pareto = new Array<Array<HistoryEntry>>();
                            let exit = false;

                            // All process alternatives that are currently part of the set of Pareto-optimal alternatives need to be compared regarding costs and transition probabilities
                            for (let j = 0; j < ar3!.length; j++)
                            {
                                if (historyEntry.isEqual(ar3![j][ar3![j].length - 1]))
                                {
                                    //Check if alternative at index j of the set of Pareto-optimal alternatives is identical with respect to the process steps applied (since costs and transition probablity are equal) 
                                    let advances_j = new Array<String>;
                                    let advances_new = new Array<String>;

                                    for (const entry of ar3![j])
                                    {
                                        if (entry.a && entry.a.name)
                                        {
                                            advances_j.push(entry.a.name)
                                        }
                                    }
                                    for (const entry of new_history)
                                    {
                                        if (entry.a && entry.a.name)
                                        {
                                            advances_new.push(entry.a.name)
                                        }
                                    }
                                    if (this.arraysHaveSameElements(advances_j, advances_new) == false)
                                    {
                                        pareto.push(ar3![j]);
                                    }
                                }
                                else if (historyEntry.cost_acc > ar3![j][ar3![j].length - 1].cost_acc && historyEntry.prob_acc <= ar3![j][ar3![j].length - 1].prob_acc || historyEntry.cost_acc >= ar3![j][ar3![j].length - 1].cost_acc && historyEntry.prob_acc < ar3![j][ar3![j].length - 1].prob_acc)
                                {
                                    // Alternative j strctly dominating over new_history --> new_history can never be optimal
                                    exit = true;
                                    break;
                                }
                                else if (historyEntry.cost_acc < ar3![j][ar3![j].length - 1].cost_acc && historyEntry.prob_acc < ar3![j][ar3![j].length - 1].prob_acc || historyEntry.cost_acc > ar3![j][ar3![j].length - 1].cost_acc && historyEntry.prob_acc > ar3![j][ar3![j].length - 1].prob_acc)
                                {
                                    //Alternative j Pareto-optimal
                                    pareto.push(ar3![j]);
                                }
                                else if (historyEntry.cost_acc < ar3![j][ar3![j].length - 1].cost_acc && historyEntry.prob_acc >= ar3![j][ar3![j].length - 1].prob_acc || historyEntry.cost_acc <= ar3![j][ar3![j].length - 1].cost_acc && historyEntry.prob_acc > ar3![j][ar3![j].length - 1].prob_acc)
                                {
                                    //New_history strictly dominating over alternative j --> j should not part of Pareto-optimal set anymore
                                }
                            }
                            //If new_history is Pareto-optimal --> add new_history to set of Pareto-optimal alternatives
                            if (!exit)
                            {
                                histories.push(new_history);
                                pareto.push(new_history);
                                ar!.set(ar2, pareto);
                            }
                        }
                    }
                }
            });
        });
        return histories;
    }

    public print(solution: Map<Qualityclass, Map<Qualityclass, Array<Array<HistoryEntry>>>>)
    {
        // Iterate over the outerMap (each quality class)
        for (const [outerKey, innerMap] of solution.entries())
        {
            console.log("Quality Class before remanufacturing:", JSON.stringify(outerKey.qps));
            console.log("--> No. of attainable quality classes:", innerMap.size, "\n");

            // Iterate over the innerMap (alternatives of each class)
            for (const [innerKey, value] of innerMap.entries())
            {
                console.log("Attainable quality class after remanufacturing:", JSON.stringify(innerKey.qps));
                console.log("--> No. of alternatives:", value.length);
                for (const qc_attain of value)
                {
                    qc_attain.forEach(element =>
                    {
                        console.log(element.a?.name);
                    })
                    console.log("Costs:", JSON.stringify(qc_attain[qc_attain.length - 1].cost_acc), "and probability:", JSON.stringify(qc_attain[qc_attain.length - 1].prob_acc));
                }
            }
            console.log("\n");
        }
    }
    public generateLookUpTable(solution: Map<Qualityclass, Map<Qualityclass, Array<Array<HistoryEntry>>>>, worksheet: ExcelJS.Worksheet)
    {
        const no_att_qc = [solution.values()];
        worksheet.addRow(['Number of core quality classes: ', solution.size]);
        console.log('Number of core quality classes: ', solution.size);
        worksheet.addRow(['Quality class core', 'Attainable quality class', 'Process alternative', 'Process steps', 'Costs', 'Probability']);

        let count = 0;
        let count1 = 0;

        solution.forEach((innerMap, qc_start) =>
        {
            count1 = count1 + innerMap.size;
            worksheet.addRow(['Number of process alternatives for the following core quality class: ', innerMap.size]);

            innerMap.forEach((steps, qc_attain) =>
            {
                steps.forEach(alternative =>
                {
                    count = count + 1;
                    let operations = new Array<String>;
                    alternative.forEach(step =>
                    {
                        if (step.a?.name != undefined)
                        {
                            operations.push(step.a?.name);
                        }
                    })
                    worksheet.addRow([JSON.stringify(qc_start.qps), JSON.stringify(qc_attain.qps), count, operations, alternative[alternative.length - 1].cost_acc, alternative[alternative.length - 1].prob_acc]);
                })
            });
            worksheet.addRow("");
        });

        worksheet.addRow(['Number of remanufacturing alternatives: ' + count]);
        console.log('Number of remanufacturing alternatives: ' + count);
    }

    public generateExelAttainableQC(solution: Map<Qualityclass, Map<Qualityclass, Array<Array<HistoryEntry>>>>, demand: Qualityclass[], storage: Qualityclass[], min_reliability: number, workbook1: ExcelJS.Workbook)
    {
        let worksheet1_1 = workbook1.addWorksheet('Attainable QC of Demand');
        let worksheet1_2 = workbook1.addWorksheet('ILP Matrices');

        let order = new OrderManagement();
        let options = order.getAttainableClasses(solution, demand, storage);

        let decision_variables = new Array<Array<Number>>(demand.length); // outer Array: attainable qc --> inner array: for each attainable qc define for each qc of storage if it is attainable from this qc in storage or not: 0 if impossible, 1 if possible
        let costs = new Array<Array<Number>>(demand.length);
        let probabilities = new Array<Array<Number>>(demand.length);

        for (let i = 0; i < demand.length; i++)
        {
            worksheet1_1.addRow(['Demanded quality class: ', demand[i].qps]);
            //decision_variables[i] = Array(storage.length).fill(0);

            decision_variables[i] = Array(storage.length).fill(0);
            const length = storage.length;
            costs[i] = Array.from({ length }, () => 1000000000000000);
            probabilities[i] = Array(storage.length).fill(0);

            if (options.get(demand[i]) != undefined)
            {
                worksheet1_1.addRow(['', '--> Attainable through remanufacturing: ', 'Quality class of core suitable for remanufacturing', 'Costs', 'Probability']);
                options.get(demand[i])?.forEach((opt) =>
                {
                    for (let index = 0; index < storage.length; index++)
                    {
                        if (this.compareArrays(opt[0].qps, storage[index].qps))
                        {
                            if (opt[2] >= min_reliability)
                            {
                                if (opt[1] < costs[i][index].valueOf())
                                {
                                    decision_variables[i][index] = 1;
                                    costs[i][index] = opt[1];
                                    probabilities[i][index] = opt[2];
                                }
                                else if (opt[1] == costs[i][index].valueOf() && opt[2] > probabilities[i][index].valueOf())
                                {
                                        decision_variables[i][index] = 1;
                                        costs[i][index] = opt[1];
                                        probabilities[i][index] = opt[2];
                                }
                            }
                        }
                    }
                    worksheet1_1.addRow(['', '', opt[0].qps, opt[1], opt[2]]);
                });
            }
            else
            {
                worksheet1_1.addRow(['', '--> Not attainable through remanufacturing']);
                let n = 0;
                let m = 0;

                for (let index = 0; index < storage.length; index++)
                {
                    if (this.compareArrays(demand[i].qps, storage[index].qps))
                    {
                        n = n + 1;
                        decision_variables[i][index] = 1;
                        costs[i][index] = 0;
                        probabilities[i][index] = 1;
                    }
                    else
                    {
                        let all_params = 0;

                        for (let j = 0; j < demand[i].qps.length; j++)
                        {
                            if ((demand[i].qps[j][1] - storage[index].qps[j][1]) <= 0.0000001)
                            {
                                all_params = all_params + 1;
                            }
                        }
                        if (all_params == demand[i].qps.length)
                        {
                            worksheet1_1.addRow(['', '--> Core of higher quality class available in stock:' + JSON.stringify(storage[index].qps)]);
                        }

                    }
                }
                worksheet1_1.addRow(['', '--> Core of equal quality class ' + n + 'x available in stock']);
            }
        }
        worksheet1_2.addRow(['Matrix rows: Attainable quality classes', 'Matrix columns: Quality classes core']);
        worksheet1_2.addRow(['Attainable QC Matrix: ', '0: not feasible by remanufacturing', '1: feasible by remanufacturing']);
        worksheet1_2.addRows(decision_variables);
        worksheet1_2.addRow(['\n']);
        worksheet1_2.addRow(['Cost Matrix']);
        worksheet1_2.addRows(costs);
        worksheet1_2.addRow(['\n']);
        worksheet1_2.addRow(['Transition Probability Matrix']);
        worksheet1_2.addRows(probabilities);

        return [decision_variables, costs, probabilities];
    }
}

