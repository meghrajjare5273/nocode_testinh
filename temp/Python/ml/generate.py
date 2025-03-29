import os
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
import pandas as pd
from io import StringIO
import asyncio
from dotenv import load_dotenv




load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

class DataRequest(BaseModel):
    prompt: str
    rows: int

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",
    google_api_key=GEMINI_API_KEY,
    temperature=0.7,
    max_output_tokens=4096  # Adjust based on API limits
)

template = """
Generate a synthetic dataset based on the following description: {prompt}.
You MUST provide EXACTLY {rows} rows in CSV format with realistic values. Do not include any extra text, explanations, or markdown (e.g., no ```csv or similar markers). Ensure the output has precisely {rows} rows, no more and no less.
Example output for "users with name, age" with 2 rows:
name,age
John Doe,34
Jane Smith,28
"""
prompt_template = PromptTemplate.from_template(template)

async def generate_batch(prompt: str, rows: int, max_attempts: int = 5) -> pd.DataFrame:
    """Generate a batch of rows, filling gaps with additional generation."""
    df_batch = pd.DataFrame()
    remaining_rows = rows
    attempt = 0

    while remaining_rows > 0 and attempt < max_attempts:
        try:
            chain = prompt_template | llm
            csv_content = await asyncio.to_thread(chain.invoke, {"prompt": prompt, "rows": remaining_rows})
            csv_content = csv_content.content.strip()
            
            # Validate CSV content
            if not csv_content or "," not in csv_content:
                raise ValueError("Invalid CSV content returned")
                
            lines = csv_content.split("\n")
            if len(lines) < 2:
                raise ValueError("Insufficient rows generated")
                
            temp_df = pd.read_csv(StringIO(csv_content))
            df_batch = pd.concat([df_batch, temp_df], ignore_index=True)
            
            # Check total rows
            if len(df_batch) >= rows:
                df_batch = df_batch.iloc[:rows]  # Truncate if too many
                break
            else:
                remaining_rows = rows - len(df_batch)
                print(f"Generated {len(temp_df)} rows, still need {remaining_rows} more (attempt {attempt + 1}/{max_attempts})")
            
            attempt += 1
            await asyncio.sleep(1)  # Backoff before next attempt
        except Exception as e:
            print(f"Batch generation failed (attempt {attempt + 1}/{max_attempts}): {str(e)}")
            attempt += 1
            if attempt == max_attempts:
                raise Exception(f"Failed to generate exact {rows} rows after {max_attempts} attempts: {str(e)}")
            await asyncio.sleep(1)

    if len(df_batch) < rows:
        raise Exception(f"Could only generate {len(df_batch)} rows instead of {rows} after {max_attempts} attempts")
    
    return df_batch

async def stream_csv(batches):
    """Stream CSV data incrementally without metadata prefix in content."""
    is_first_batch = True
    for batch in batches:
        stream = StringIO()
        if is_first_batch:
            batch.to_csv(stream, index=False)
            is_first_batch = False
        else:
            batch.to_csv(stream, index=False, header=False)
        yield stream.getvalue()