import logging
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LogisticRegression, LinearRegression, Ridge, Lasso
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.svm import SVC, SVR
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.metrics import silhouette_score, calinski_harabasz_score
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE



logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ModelTrainer:
    """
    Class for training and evaluating machine learning models
    """
    
    def __init__(self):
        """Initialize the model trainer with available models"""
        self.classification_models = {
            'logistic_regression': LogisticRegression(max_iter=1000),
            'random_forest': RandomForestClassifier(),
            'decision_tree': DecisionTreeClassifier(),
            'knn': KNeighborsClassifier(),
            'svm': SVC(probability=True),
            'gradient_boosting': GradientBoostingClassifier()
        }
        
        self.regression_models = {
            'linear_regression': LinearRegression(),
            'random_forest': RandomForestRegressor(),
            'decision_tree': DecisionTreeRegressor(),
            'knn': KNeighborsRegressor(),
            'svm': SVR(),
            'ridge': Ridge(),
            'lasso': Lasso(),
            'gradient_boosting': GradientBoostingRegressor()
        }
        
        self.clustering_models = {
            'kmeans': KMeans(n_clusters=3),
            'dbscan': DBSCAN(),
            'agglomerative': AgglomerativeClustering(n_clusters=3)
        }
        
        self.dimensionality_reduction = {
            'pca': PCA(n_components=2),
            'tsne': TSNE(n_components=2)
        }

    def train_model(self, df, target_column=None, task_type="clustering", model_type=None, params=None):
        """
        Train a model based on the specified task type and model type
        
        Args:
            df (pd.DataFrame): Input data
            target_column (str): Target column name
            task_type (str): Type of ML task (classification, regression, clustering)
            model_type (str): Type of model to use
            params (dict): Optional parameters for the model
            
        Returns:
            dict: Dictionary with model results
        """
        try:
            if task_type not in ["classification", "regression", "clustering", "dimensionality_reduction"]:
                logger.error(f"Unsupported task type: {task_type}")
                return {"error": f"Unsupported task type: {task_type}"}
                
            logger.info(f"Training with task_type: {task_type}, model_type: {model_type}, target_column: {target_column}")
            logger.debug(f"DataFrame columns: {df.columns.tolist()}")
            
            # Set default model type if not specified
            if model_type is None:
                if task_type == "classification":
                    model_type = "logistic_regression"
                elif task_type == "regression":
                    model_type = "linear_regression"
                elif task_type == "clustering":
                    model_type = "kmeans"
                elif task_type == "dimensionality_reduction":
                    model_type = "pca"
            
            # Handle supervised tasks (classification, regression)
            if task_type in ["classification", "regression"]:
                if target_column and target_column in df.columns:
                    X = df.drop(columns=[target_column])
                    y = df[target_column]
                    logger.debug(f"Features (X) shape: {X.shape}, Target (y) shape: {y.shape}")
                    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
                else:
                    logger.error(f"No valid target column '{target_column}' provided for {task_type}")
                    return {"error": f"No valid target column '{target_column}' provided for {task_type}"}
            else:
                # Handle unsupervised tasks
                X = df
                X_train, X_test = train_test_split(X, test_size=0.2, random_state=42)
                y = None
            
            if X.empty:
                logger.error("Error: Feature set (X) is empty after preprocessing.")
                return {"error": "No features available for training after preprocessing"}
            
            # Select model based on task type and model type
            if task_type == "classification":
                return self._train_classification(X_train, X_test, y_train, y_test, model_type, params)
            elif task_type == "regression":
                return self._train_regression(X_train, X_test, y_train, y_test, model_type, params)
            elif task_type == "clustering":
                return self._train_clustering(X_train, X_test, model_type, params)
            elif task_type == "dimensionality_reduction":
                return self._train_dimensionality_reduction(X_train, model_type, params)
            
            logger.error("Reached default case: No valid task logic executed")
            return {"error": "No valid task provided"}
        
        except Exception as e:
            logger.error(f"Error in train_model: {str(e)}")
            return {"error": f"Training failed: {str(e)}"}
    
    def _train_classification(self, X_train, X_test, y_train, y_test, model_type, params=None):
        """Train a classification model"""
        if model_type not in self.classification_models:
            logger.error(f"Unsupported classification model: {model_type}")
            return {"error": f"Unsupported classification model: {model_type}"}
        
        # Create a copy of the model to avoid modifying the original
        model = self.classification_models[model_type]
        
        # Apply parameters if provided
        if params:
            model.set_params(**params)
        
        # Train the model
        model.fit(X_train, y_train)
        
        # Evaluate the model
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred, average='weighted', zero_division=0)
        recall = recall_score(y_test, y_pred, average='weighted', zero_division=0)
        f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)
        
        # Get feature importance if available
        feature_importance = self._get_feature_importance(model, X_train.columns)
        
        # Cross-validation score
        cv_scores = cross_val_score(model, X_train, y_train, cv=5)
        
        logger.info(f"Classification metrics: Accuracy={accuracy:.4f}, Precision={precision:.4f}, Recall={recall:.4f}, F1={f1:.4f}")
        
        return {
            "task_type": "classification",
            "model_type": model_type,
            "results": {
                "accuracy": float(accuracy),
                "precision": float(precision),
                "recall": float(recall),
                "f1_score": float(f1),
                "cv_scores": cv_scores.tolist(),
                "cv_mean": float(cv_scores.mean()),
                "cv_std": float(cv_scores.std())
            },
            "feature_importance": feature_importance,
            "model": model
        }
    
    def _train_regression(self, X_train, X_test, y_train, y_test, model_type, params=None):
        """Train a regression model"""
        if model_type not in self.regression_models:
            logger.error(f"Unsupported regression model: {model_type}")
            return {"error": f"Unsupported regression model: {model_type}"}
        
        # Create a copy of the model to avoid modifying the original
        model = self.regression_models[model_type]
        
        # Apply parameters if provided
        if params:
            model.set_params(**params)
        
        # Train the model
        model.fit(X_train, y_train)
        
        # Evaluate the model
        y_pred = model.predict(X_test)
        r2 = r2_score(y_test, y_pred)
        mse = mean_squared_error(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)
        
        # Get feature importance if available
        feature_importance = self._get_feature_importance(model, X_train.columns)
        
        # Cross-validation score
        cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='r2')
        
        logger.info(f"Regression metrics: R²={r2:.4f}, MSE={mse:.4f}, MAE={mae:.4f}")
        
        return {
            "task_type": "regression",
            "model_type": model_type,
            "results": {
                "r2_score": float(r2),
                "mean_squared_error": float(mse),
                "mean_absolute_error": float(mae),
                "cv_scores": cv_scores.tolist(),
                "cv_mean": float(cv_scores.mean()),
                "cv_std": float(cv_scores.std())
            },
            "feature_importance": feature_importance,
            "model": model
        }
    
    def _train_clustering(self, X_train, X_test, model_type, params=None):
        """Train a clustering model"""
        if model_type not in self.clustering_models:
            logger.error(f"Unsupported clustering model: {model_type}")
            return {"error": f"Unsupported clustering model: {model_type}"}
        
        # Create a copy of the model to avoid modifying the original
        model = self.clustering_models[model_type]
        
        # Apply parameters if provided
        if params:
            model.set_params(**params)
        
        # Train the model
        model.fit(X_train)
        
        # Not all clustering models provide labels the same way
        try:
            labels = model.predict(X_test)
        except:
            try:
                labels = model.fit_predict(X_test)
            except:
                logger.warning(f"Could not get labels for {model_type} on test data")
                labels = None
        
        # Evaluate the model if labels are available
        metrics = {}
        if labels is not None and len(np.unique(labels)) > 1 and len(X_test) > 1:
            try:
                silhouette = silhouette_score(X_test, labels)
                metrics["silhouette_score"] = float(silhouette)
            except:
                logger.warning("Could not calculate silhouette score")
            
            try:
                calinski = calinski_harabasz_score(X_test, labels)
                metrics["calinski_harabasz_score"] = float(calinski)
            except:
                logger.warning("Could not calculate Calinski-Harabasz score")
        
        # For KMeans, include inertia
        if model_type == "kmeans":
            metrics["inertia"] = float(model.inertia_)
        
        logger.info(f"Clustering metrics: {metrics}")
        
        return {
            "task_type": "clustering",
            "model_type": model_type,
            "results": metrics,
            "model": model
        }
    
    def _train_dimensionality_reduction(self, X_train, model_type, params=None):
        """Train a dimensionality reduction model"""
        if model_type not in self.dimensionality_reduction:
            logger.error(f"Unsupported dimensionality reduction model: {model_type}")
            return {"error": f"Unsupported dimensionality reduction model: {model_type}"}
        
        # Create a copy of the model to avoid modifying the original
        model = self.dimensionality_reduction[model_type]
        
        # Apply parameters if provided
        if params:
            model.set_params(**params)
        
        # Transform the data
        X_reduced = model.fit_transform(X_train)
        
        # Metrics specific to dimensionality reduction
        metrics = {}
        if model_type == "pca":
            explained_variance = model.explained_variance_ratio_
            metrics["explained_variance_ratio"] = explained_variance.tolist()
            metrics["cumulative_variance"] = np.cumsum(explained_variance).tolist()
        
        logger.info(f"Dimensionality reduction complete: {model_type}")
        
        return {
            "task_type": "dimensionality_reduction",
            "model_type": model_type,
            "results": metrics,
            "transformed_data": X_reduced.tolist()[:100],  # Limit to first 100 samples
            "model": model
        }
    
    def _get_feature_importance(self, model, feature_names):
        """Extract feature importance from a model if available"""
        importance_dict = {}
        
        if hasattr(model, 'feature_importances_'):
            importance_dict = dict(zip(feature_names, model.feature_importances_))
        elif hasattr(model, 'coef_'):
            if len(model.coef_.shape) == 1:
                importance_dict = dict(zip(feature_names, abs(model.coef_)))
            else:
                importance_dict = dict(zip(feature_names, np.mean(abs(model.coef_), axis=0)))
        
        # Sort by importance and convert to list of tuples
        sorted_importance = sorted(importance_dict.items(), key=lambda x: x[1], reverse=True)
        return sorted_importance

# Create a global instance for easier imports
model_trainer = ModelTrainer()

# For backwards compatibility
def train_model(df, target_column=None, task_type="clustering", model_type=None, params=None):
    """Wrapper function for backward compatibility"""
    return model_trainer.train_model(df, target_column, task_type, model_type, params)

def save_model(model, file_path="uploads/trained_model.pkl"):
    """Save a trained model to disk"""
    try:
        joblib.dump(model, file_path)
        logger.info(f"Model saved to {file_path}")
        return True
    except Exception as e:
        logger.error(f"Error saving model: {str(e)}")
        return False