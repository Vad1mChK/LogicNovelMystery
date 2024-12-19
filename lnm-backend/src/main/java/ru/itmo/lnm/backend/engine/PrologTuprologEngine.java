package ru.itmo.lnm.backend.engine;

import alice.tuprolog.*;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class PrologTuprologEngine implements PrologEngine {
    private Prolog prolog;

    public PrologTuprologEngine() {
        prolog = new Prolog();
        try {
            prolog.loadLibrary("alice.tuprolog.lib.BasicLibrary");
        } catch (Exception e) {
            System.out.println("Error loading Prolog library: " + e.getMessage());
        }
    }

    @Override
    public void clear() {
        prolog.clearTheory();
    }

    @Override
    public void loadKnowledge(List<String> knowledge) {
        for (String knowledgeLine : knowledge) {
            try {
                prolog.addTheory(new Theory(knowledgeLine));
            } catch (Exception e) {
                System.out.println("Error adding theory: " + e.getMessage());
            }
        }
    }

    @Override
    public List<Map<String, String>> runQuery(String query) {
        List<Map<String, String>> solutions = new ArrayList<>();
        try {
            SolveInfo querySolveInfo = prolog.solve(query); // Initial solve call
            processSolution(querySolveInfo, solutions);

            // Continue fetching alternative solutions
            while (prolog.hasOpenAlternatives()) {
                SolveInfo nextSolution = prolog.solveNext();
                processSolution(nextSolution, solutions);
            }
        } catch (Exception e) {
            System.out.println("Error running query: " + e.getMessage());
        }
        return solutions;
    }

    private void processSolution(SolveInfo solveInfo, List<Map<String, String>> solutions) {
        if (solveInfo.isSuccess()) {
            Map<String, String> variableBindings = new HashMap<>();
            try {
                for (Var variable : solveInfo.getBindingVars()) {
                    String variableName = variable.getName();
                    String variableValue = solveInfo.getTerm(variableName).toString();
                    variableBindings.put(variableName, variableValue);
                    System.out.println(variableName);
                }
            } catch (Exception e) {
                System.out.println("Error processing solution: " + e.getMessage());
            }
            solutions.add(variableBindings);
        }
    }
}
