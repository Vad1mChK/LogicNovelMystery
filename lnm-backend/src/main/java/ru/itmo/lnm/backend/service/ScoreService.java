package ru.itmo.lnm.backend.service;


import org.springframework.stereotype.Component;

@Component
public class ScoreService {

    private static final int k = 1;
    private static final int MaxPoints = 10000;
    private static final int S = 21;

    private static final double PenaltyPercent = 0.05;

    public static double scoreSolution(int number, int errorNumber){

        return MaxPoints * Math.pow(number, k) / S * (1 - PenaltyPercent * errorNumber);
    }

}
