# Python/ml/preprocess.py
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import KFold

def suggest_missing_strategy(df):
    missing_counts = df.isnull().sum()
    total_rows = len(df)
    if missing_counts.sum() == 0:
        return 'mean'
    missing_percentages = missing_counts / total_rows
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns
    if any(missing_percentages > 0.5):
        return 'drop'
    if numeric_cols.isin(missing_counts[missing_counts > 0].index).any():
        skewness = df[numeric_cols].skew()
        if any(abs(skewness) > 1):
            return 'median'
        return 'mean'
    if categorical_cols.isin(missing_counts[missing_counts > 0].index).any():
        return 'mode'
    return 'mean'

def target_encode(df, categorical_col, target_col):
    target_means = df.groupby(categorical_col)[target_col].mean()
    return df[categorical_col].map(target_means)

def kfold_target_encode(df, categorical_col, target_col, n_splits=5):
    kf = KFold(n_splits=n_splits, shuffle=True, random_state=42)
    df_encoded = df.copy()
    encoded_col = np.zeros(len(df))
    
    for train_idx, val_idx in kf.split(df):
        train_df, val_df = df.iloc[train_idx], df.iloc[val_idx]
        target_means = train_df.groupby(categorical_col)[target_col].mean()
        encoded_col[val_idx] = val_df[categorical_col].map(target_means).fillna(train_df[target_col].mean())
    
    df_encoded[categorical_col] = encoded_col
    return df_encoded

def preprocess_data(df, missing_strategy='mean', scaling=True, encoding='onehot', target_column=None):
    try:
        df_processed = df.copy()
        
        # Handle missing values (supports dict for column-specific strategies)
        print(f"Handling missing values with strategy: {missing_strategy}")
        if isinstance(missing_strategy, dict):
            for col, strategy in missing_strategy.items():
                if col in df_processed.columns:
                    if strategy == 'mean':
                        df_processed[col].fillna(df_processed[col].mean(), inplace=True)
                    elif strategy == 'median':
                        df_processed[col].fillna(df_processed[col].median(), inplace=True)
                    elif strategy == 'mode':
                        df_processed[col].fillna(df_processed[col].mode()[0], inplace=True)
                    elif strategy == 'drop':
                        df_processed.dropna(subset=[col], inplace=True)
        else:
            if missing_strategy == 'mean':
                numeric_cols = df_processed.select_dtypes(include=[np.number]).columns
                for col in numeric_cols:
                    df_processed[col].fillna(df_processed[col].mean(), inplace=True)
            elif missing_strategy == 'median':
                numeric_cols = df_processed.select_dtypes(include=[np.number]).columns
                for col in numeric_cols:
                    df_processed[col].fillna(df_processed[col].median(), inplace=True)
            elif missing_strategy == 'mode':
                for col in df_processed.columns:
                    df_processed[col].fillna(df_processed[col].mode()[0], inplace=True)
            elif missing_strategy == 'drop':
                df_processed.dropna(inplace=True)

        # Identify numeric and categorical columns dynamically
        numeric_cols = df_processed.select_dtypes(include=[np.number]).columns.tolist()
        categorical_cols = df_processed.select_dtypes(include=['object', 'category']).columns.tolist()

        # Remove target_column from features if provided
        if target_column and target_column in df_processed.columns:
            if target_column in numeric_cols:
                numeric_cols.remove(target_column)
            elif target_column in categorical_cols:
                categorical_cols.remove(target_column)

        print(f"Numeric columns: {numeric_cols}")
        print(f"Categorical columns: {categorical_cols}")

        # Create preprocessing pipeline with column-specific encoding
        transformers = []
        if numeric_cols and scaling:
            transformers.append(('num', StandardScaler(), numeric_cols))
        elif numeric_cols:
            transformers.append(('num', 'passthrough', numeric_cols))
        
        if categorical_cols:
            if isinstance(encoding, dict):
                for col in categorical_cols:
                    enc = encoding.get(col, 'onehot')
                    if enc == 'onehot':
                        transformers.append((f'cat_{col}', OneHotEncoder(drop='first', sparse_output=False, handle_unknown='ignore'), [col]))
                    elif enc == 'label':
                        le = LabelEncoder()
                        df_processed[col] = le.fit_transform(df_processed[col].astype(str))
                        transformers.append((f'cat_{col}', 'passthrough', [col]))
                    elif enc == 'target' and target_column and target_column in df_processed.columns:
                        df_processed[col] = target_encode(df_processed, col, target_column)
                        transformers.append((f'cat_{col}', 'passthrough', [col]))
                    elif enc == 'kfold' and target_column and target_column in df_processed.columns:
                        df_processed = kfold_target_encode(df_processed, col, target_column)
                        transformers.append((f'cat_{col}', 'passthrough', [col]))
                    else:
                        transformers.append((f'cat_{col}', OneHotEncoder(drop='first', sparse_output=False, handle_unknown='ignore'), [col]))
            else:
                if encoding == 'onehot':
                    transformers.append(('cat', OneHotEncoder(drop='first', sparse_output=False, handle_unknown='ignore'), categorical_cols))
                elif encoding == 'label':
                    for col in categorical_cols:
                        le = LabelEncoder()
                        df_processed[col] = le.fit_transform(df_processed[col].astype(str))
                    transformers.append(('cat', 'passthrough', categorical_cols))
                elif encoding == 'target' and target_column and target_column in df_processed.columns:
                    for col in categorical_cols:
                        df_processed[col] = target_encode(df_processed, col, target_column)
                    transformers.append(('cat', 'passthrough', categorical_cols))
                elif encoding == 'kfold' and target_column and target_column in df_processed.columns:
                    for col in categorical_cols:
                        df_processed = kfold_target_encode(df_processed, col, target_column)
                    transformers.append(('cat', 'passthrough', categorical_cols))
                else:
                    print(f"Warning: Invalid encoding '{encoding}' or missing target column. Falling back to one-hot encoding.")
                    transformers.append(('cat', OneHotEncoder(drop='first', sparse_output=False, handle_unknown='ignore'), categorical_cols))

        if not transformers:
            print("No columns to preprocess after handling missing values")
            if target_column and target_column in df.columns:
                return df_processed[[target_column] + [col for col in df_processed.columns if col != target_column]]
            return df_processed

        preprocessor = ColumnTransformer(transformers=transformers, remainder='passthrough', force_int_remainder_cols=False)
        transformed_data = preprocessor.fit_transform(df_processed)
        
        # Get feature names after transformation
        feature_names = []
        for name, transformer, cols in preprocessor.transformers_:
            if name == 'num':
                feature_names.extend(cols)
            elif name.startswith('cat_') and 'onehot' in (encoding if isinstance(encoding, str) else encoding.get(cols[0], 'onehot')):
                feature_names.extend(preprocessor.named_transformers_[name].get_feature_names_out(cols))
            else:
                feature_names.extend(cols)
        
        if target_column and target_column in df.columns:
            target_data = df_processed[[target_column]].values
            transformed_data = np.hstack((transformed_data, target_data))
            feature_names.append(target_column)

        df_processed = pd.DataFrame(transformed_data, columns=feature_names)
        return df_processed
    except Exception as e:
        print(f"Error in preprocess_data: {str(e)}")
        raise

def save_preprocessed_data(df, filename="preprocessed_data.csv"):
    try:
        file_path = f"uploads/{filename}"
        df.to_csv(file_path, index=False)
        return file_path
    except Exception as e:
        print(f"Error saving preprocessed data: {str(e)}")
        raise