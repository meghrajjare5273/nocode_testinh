/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ModelOption } from "@/types";

// Define available models for each task type
export const classificationModels: ModelOption[] = [
  { display: "Logistic Regression", key: "logistic_regression" },
  { display: "Random Forest", key: "random_forest" },
  { display: "Decision Tree", key: "decision_tree" },
  { display: "K-Nearest Neighbors", key: "knn" },
  { display: "Support Vector Machine", key: "svm" },
  { display: "Gradient Boosting", key: "gradient_boosting" },
];

export const regressionModels: ModelOption[] = [
  { display: "Linear Regression", key: "linear_regression" },
  { display: "Random Forest", key: "random_forest" },
  { display: "Decision Tree", key: "decision_tree" },
  { display: "K-Nearest Neighbors", key: "knn" },
  { display: "Support Vector Machine", key: "svm" },
  { display: "Ridge Regression", key: "ridge" },
  { display: "Lasso Regression", key: "lasso" },
  { display: "Gradient Boosting", key: "gradient_boosting" },
];

export const clusteringModels: ModelOption[] = [
  { display: "K-Means", key: "kmeans" },
  { display: "DBSCAN", key: "dbscan" },
  { display: "Agglomerative Clustering", key: "agglomerative" },
];

// Function to get available models based on task type
export const getAvailableModels = (taskType: string): ModelOption[] => {
  switch (taskType) {
    case "classification":
      return classificationModels;
    case "regression":
      return regressionModels;
    case "clustering":
      return clusteringModels;
    default:
      return [];
  }
};

// Function to get chart data for visualization
export const getChartData = (result: any) =>
  result && {
    labels: Object.keys(result.results || {}),
    datasets: [
      {
        label:
          result.task_type === "classification"
            ? "Accuracy"
            : result.task_type === "clustering"
            ? "Silhouette Score"
            : "R² Score",
        data: Object.values(result.results || {}).map((v: any) =>
          v === null ? 0 : v
        ),
        backgroundColor: "rgba(56, 189, 248, 0.8)",
        borderColor: "rgb(14, 165, 233)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };
