package com.ai.lms.assessment;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("questions")
public class Question {
    @Id
    private Long id;
    private Long quizId;
    private String text;
    private String options; // JSON or comma-separated
    private String correctAnswer;
    private Integer points;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getQuizId() { return quizId; }
    public void setQuizId(Long quizId) { this.quizId = quizId; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public String getOptions() { return options; }
    public void setOptions(String options) { this.options = options; }
    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }
    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }
} 