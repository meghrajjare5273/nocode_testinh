import pandas as pd
import numpy as np
import os
import logging
from typing import Dict, List, Optional, Union, Tuple
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai import GenerativeModel

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DatasetAnalyzer:
    """
    A class for analyzing datasets and providing insights and recommendations
    for machine learning tasks.
    """
    
    VALID_TASK_TYPES = [
        "classification", 
        "regression", 
        "clustering", 
        "dimensionality_reduction", 
        "anomaly_detection", 
        "time_series", 
        "reinforcement_learning"
    ]
    
    DEFAULT_TASK = "clustering"
    DEFAULT_TARGET = None
    
    def __init__(self):
        """Initialize the DatasetAnalyzer with Gemini API if available."""
        load_dotenv()
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model = None
        
        if self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = GenerativeModel('gemini-1.5-flash')
                logger.info("Gemini API configured successfully.")
            except Exception as e:
                logger.error(f"Error configuring Gemini API: {str(e)}. Will use fallback analysis.")
        else:
            logger.warning("GEMINI_API_KEY not found in environment variables. Will use fallback analysis.")
    
    def get_dataset_insights(self, 
                           summary: Dict, 
                           df: Optional[pd.DataFrame] = None) -> Dict:
        """
        Analyze dataset summary and provide insights and recommendations.
        
        Args:
            summary: Dictionary containing dataset summary (columns, data types, missing values)
            df: Optional DataFrame for fallback analysis if API is unavailable
            
        Returns:
            Dictionary with insights, suggested task type, and target column
        """
        if not isinstance(summary, dict):
            raise TypeError("Summary must be a dictionary")
            
        required_keys = ["columns", "data_types", "missing_values"]
        if not all(key in summary for key in required_keys):
            raise ValueError(f"Summary must contain the following keys: {required_keys}")
            
        # Try using Gemini API if available
        if self.model:
            try:
                return self._get_insights_from_api(summary)
            except Exception as e:
                logger.error(f"Error generating insights with Gemini API: {str(e)}")
                logger.info("Falling back to manual analysis.")
        
        # Fallback to manual analysis
        return self._get_insights_manually(summary, df)
    
    def _get_insights_from_api(self, summary: Dict) -> Dict:
        """
        Get dataset insights using the Gemini API.
        
        Args:
            summary: Dictionary containing dataset summary
            
        Returns:
            Dictionary with insights, suggested task type, and target column
        """
        columns = summary["columns"]
        data_types = summary["data_types"]
        missing_values = summary["missing_values"]
        
        prompt = (
            f"I have a dataset with the following details:\n"
            f"Columns: {columns}\n"
            f"Data Types: {data_types}\n"
            f"Missing Values: {missing_values}\n\n"
            f"1. Provide 3-5 bullet point insights about the dataset (e.g., potential issues, interesting patterns). "
            f"Format each point as '- Point text here' on a new line.\n"
            f"2. Suggest the most suitable machine learning task type (choose one): "
            f"{', '.join(self.VALID_TASK_TYPES)}.\n"
            f"3. If the task type requires a target column (e.g., classification, regression), recommend the best target column from the list of columns. "
            f"If the task type does not require a target column (e.g., clustering), return 'None' for the target column."
        )
        
        response = self.model.generate_content(prompt)
        response_text = response.text
        logger.debug(f"Gemini API response preview: {response_text[:100]}...")
        
        # Default values
        insights = []
        suggested_task_type = self.DEFAULT_TASK
        suggested_target_column = self.DEFAULT_TARGET
        
        # Parse the response
        sections = response_text.split('\n\n')
        for section in sections:
            lines = section.split('\n')
            for line in lines:
                line = line.strip()
                
                # Extract bullet point insights
                if line.startswith('- '):
                    insights.append(line[2:])  # Remove '- ' prefix
                
                # Extract task type suggestion
                elif line.startswith("2."):
                    task = line.replace("2.", "").strip().lower()
                    if any(valid_task in task for valid_task in self.VALID_TASK_TYPES):
                        for valid_task in self.VALID_TASK_TYPES:
                            if valid_task in task:
                                suggested_task_type = valid_task
                                break
                
                # Extract target column suggestion
                elif line.startswith("3."):
                    target = line.replace("3.", "").strip()
                    if target != "None" and target in columns:
                        suggested_target_column = target
                    elif target == "None":
                        suggested_target_column = None
        
        # If no bullet points were parsed correctly, look for numbered points
        if not insights:
            for line in response_text.split('\n'):
                line = line.strip()
                if line.startswith("1.") and not line.startswith("1. Provide"):
                    # This is likely the start of numbered insights
                    insights.append(line.split(".", 1)[1].strip())
        
        # If still no insights, extract any relevant text
        if not insights:
            insights = ["No structured insights could be parsed from the API response"]
        
        return {
            "insights": insights,
            "suggested_task_type": suggested_task_type,
            "suggested_target_column": suggested_target_column
        }
    
    def _get_insights_manually(self, 
                             summary: Dict, 
                             df: Optional[pd.DataFrame] = None) -> Dict:
        """
        Get dataset insights using manual heuristics when API is unavailable.
        
        Args:
            summary: Dictionary containing dataset summary
            df: Optional DataFrame for analysis
            
        Returns:
            Dictionary with insights, suggested task type, and target column
        """
        columns = summary["columns"]
        data_types = summary["data_types"]
        missing_values = summary["missing_values"]
        
        # Initialize insights as list
        insights = []
        
        # Add initial insight about data size
        if df is not None:
            insights.append(f"Dataset contains {df.shape[0]} rows and {df.shape[1]} columns")
        else:
            insights.append(f"Dataset contains {len(columns)} columns")
        
        # Add insight about missing values
        missing_cols = [col for col, count in missing_values.items() if count > 0]
        if missing_cols:
            insights.append(f"Missing values detected in {len(missing_cols)} columns: {', '.join(missing_cols[:3])}{'...' if len(missing_cols) > 3 else ''}")
        else:
            insights.append("No missing values detected in the dataset")
        
        # Default ML task suggestion
        suggested_task_type = self.DEFAULT_TASK
        suggested_target_column = self.DEFAULT_TARGET
        
        if df is None:
            insights.append("Cannot perform detailed analysis without DataFrame object")
            return {
                "insights": insights,
                "suggested_task_type": suggested_task_type,
                "suggested_target_column": suggested_target_column
            }
        
        # Analyze data types
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
        datetime_cols = df.select_dtypes(include=['datetime64']).columns.tolist()
        
        # Add insight about data types
        insights.append(f"Dataset contains {len(numeric_cols)} numeric, {len(categorical_cols)} categorical{f', and {len(datetime_cols)} datetime' if datetime_cols else ''} columns")
        
        # Check for potential classification targets
        for col in categorical_cols:
            unique_values = df[col].nunique()
            if 2 <= unique_values <= 10:
                # Get class distribution
                class_dist = df[col].value_counts(normalize=True)
                balance_info = "balanced" if class_dist.max() < 0.7 else "imbalanced"
                
                insights.append(f"Column '{col}' has {unique_values} unique values with {balance_info} distribution")
                suggested_task_type = "classification"
                suggested_target_column = col
                break
        
        # Check for potential regression targets if no classification target found
        if suggested_target_column is None:
            for col in numeric_cols:
                unique_values = df[col].nunique()
                if unique_values > 20:
                    # Get distribution info
                    skew = df[col].skew()
                    skew_desc = "highly skewed" if abs(skew) > 1 else "relatively normal"
                    
                    insights.append(f"Column '{col}' has continuous values with {skew_desc} distribution (skew: {skew:.2f})")
                    suggested_task_type = "regression"
                    suggested_target_column = col
                    break
        
        # Check for time series data if no target found yet
        if suggested_target_column is None and datetime_cols:
            insights.append(f"Time-based column '{datetime_cols[0]}' detected, suggesting time series analysis potential")
            suggested_task_type = "time_series"
            suggested_target_column = numeric_cols[0] if numeric_cols else None
        
        # If still no target found, suggest clustering
        if suggested_target_column is None:
            insights.append("No obvious target variables detected, suggesting clustering for exploratory analysis")
        
        return {
            "insights": insights,
            "suggested_task_type": suggested_task_type,
            "suggested_target_column": suggested_target_column
        }

# Create a global instance for easier imports
dataset_analyzer = DatasetAnalyzer()

# For backwards compatibility with code using the function
def get_dataset_insights(summary, df=None):
    """
    Wrapper function for backward compatibility.
    """
    return dataset_analyzer.get_dataset_insights(summary, df)