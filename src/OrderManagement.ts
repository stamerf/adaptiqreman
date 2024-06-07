import Qualityclass from "./Qualityclass";
import HistoryEntry from "./HistoryEntry";
import Functions from "./Functions";
import solver from 'javascript-lp-solver/src/solver';
import Model from 'javascript-lp-solver/src/Model';
import * as ExcelJS from 'exceljs';

export default class OrderManagement
{
    public getAttainableClasses(solution: Map<Qualityclass, Map<Qualityclass, Array<Array<HistoryEntry>>>>, demand: Qualityclass[], storage: Qualityclass[])
    {
        let options = new Map<Qualityclass, Array<[Qualityclass, number, number]>>();
        let functions = new Functions();
        solution.forEach((innerMap1, qc_start) =>
        {
            storage.forEach((qc_storage) =>
            {
                if (functions.compareArrays(qc_start.qps, qc_storage.qps))
                {
                    innerMap1.forEach((alternatives, qc_attain) =>
                    {
                        demand.forEach((qc_demand) =>
                        {
                            if (functions.compareArrays(qc_demand.qps, qc_attain.qps))
                            {
                                alternatives.forEach(steps =>
                                {
                                    //let option = [qc_start.qps, qc_attain.qps, step[step.length - 1].cost_acc, step[step.length - 1].prob_acc];

                                    let qc_after: Qualityclass | undefined = undefined;
                                    let qc_before: Array<[Qualityclass, number, number]> | undefined = undefined;
                                    options.forEach((val, key) =>
                                    {
                                        if (functions.compareArrays(key.qps, qc_demand.qps))
                                        {
                                            qc_after = qc_demand;
                                            qc_before = val;
                                        }
                                    })
                                    if (qc_after === undefined)
                                    {
                                        options.set(qc_demand, [[qc_start, steps[steps.length - 1].cost_acc, steps[steps.length - 1].prob_acc]]);
                                    }
                                    else 
                                    {
                                        qc_before!.push([qc_start, steps[steps.length - 1].cost_acc, steps[steps.length - 1].prob_acc]);
                                        options.set(qc_demand, qc_before!);
                                    }
                                    //worksheet1.addRow(option);
                                })
                            }
                        })
                    })
                }
            })
        });
        return options;
    }

    public order_management(costs: Number[][], demand: Qualityclass[], storage: Qualityclass[], workbook1: ExcelJS.Workbook)
    {
        let worksheet1_3 = workbook1.addWorksheet('ILP Solution');

        // Create a model for the linear programming problem
        let model = new Model();

        model = {
            "optimize": "cost",
            "opType": "min",
            "constraints": {"cost2": { "max": 100000000000000} },
            "variables": {}
        }

        // Create and define the two-dimensional variables
        for (let i = 0; i < demand.length; i++)
        {
            for (let j = 0; j < storage.length; j++)
            {
                let variable = { [`x${i}_${j}`]: { "cost": costs[i][j], "cost2": costs[i][j], [`row_${i}`]: 1, [`col_${j}`]: 1 } };

                model.variables = {
                    ...model.variables,
                    ...variable
                };
            }
        }

        for (let i = 0; i < demand.length; i++)
        {
            let constraint = { [`row_${i}`]: { "max": 1, "min": 1 } };

            model.constraints = {
                ...model.constraints,
                ...constraint
            };
        }

        for (let j = 0; j < storage.length; j++)
        {
            let constraint = { [`col_${j}`]: { "max": 1, "min": 0 } };

            model.constraints = {
                ...model.constraints,
                ...constraint
            };
        }

        //console.log(model.constraints);
        //console.log(model.variables);

        let results = solver.Solve(model);
        //console.log(results);

        if (results.feasible)
        {
            worksheet1_3.addRow(['Feasible:', results.feasible]);
            worksheet1_3.addRow(['Bounded:', results.bounded]);
            worksheet1_3.addRow(['Objective Value:', results.result]);

            for (const variableName in model.variables)
            {
                const variableValue = results[variableName];
                if (results[variableName] != undefined)
                {
                    worksheet1_3.addRow([`Value of ${variableName}`, variableValue]);
                }
                else
                {
                    worksheet1_3.addRow([`Value of ${variableName}`, 0]);
                }
            }
        }
        else
        {
            worksheet1_3.addRow(['Feasible:', results.feasible]);
            worksheet1_3.addRow(['Bounded:', results.bounded]);
            console.log('No feasible solution found.');
        }
        return results;
    }
}