import os
import random
import json
import re
from dotenv import load_dotenv
from groq import Groq
import uuid
import pandas as pd
from datetime import datetime
from elevenlabs import ElevenLabs, VoiceSettings

from flask import Flask, request, jsonify,session,Response
from flask_cors import CORS
from flask_session import Session

from datetime import datetime,timezone
from dateutil import parser

#Setup Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True)

# Configure server-side sessions (only for start/end of chat)
app.config['SECRET_KEY'] = os.urandom(24)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_DIR'] = './flask_session/'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
Session(app)

load_dotenv()
os.environ['GROQ_API_KEY'] = os.getenv("GROQ_API_KEY")
client = Groq()
api_key = os.environ.get("GROQ_API_KEY"
)
elevenLabs_API_KEY = os.getenv("elevenLabs_API_KEY")
elevenlabs_client = ElevenLabs(
    api_key=elevenLabs_API_KEY,
)
# Load your questions dataset
df = pd.read_csv('Questions.csv')


def chat_with_llama(user_prompt, chat_history, course_context):
    # Prepare messages for the LLM interaction
    messages = [
        {"role": "system", "content": f"You are a helpful assistant. Give answer in maximum 25 lines. The financial course context is as follows: {course_context}"},
        *chat_history
    ]

    # Send user's message to the LLM and get a response
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=messages,
        temperature=0.5,
        max_tokens=2048,
        top_p=1,
        stream=False,
        stop=None
    )

    # Extract the assistant's response
    assistant_response = response.choices[0].message.content

    return assistant_response

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    chat_history = data.get('chatHistory', [])
    course_context = data.get('courseContext', '')
    
    if not user_message or not course_context:
        return jsonify({"error": "Message or course context missing"}), 400

    response = chat_with_llama(user_message, chat_history, course_context)
    
    return jsonify({"response": response})

@app.route('/start_session', methods=['POST'])
def start_session():
    data = request.json
    course_context = data.get('context')
    
    if not course_context:
        return jsonify({"error": "No context provided"}), 400

    # Generate a unique session ID
    session_id = str(uuid.uuid4())
    session['session_id'] = session_id
    session['course_context'] = course_context

    return jsonify({"session_id": session_id, "message": "New session started with provided context"})

@app.route('/end_session', methods=['POST'])
def end_session():
    session.clear()
    return jsonify({"message": "Session ended"})


# Generator Functions for Questions
def get_unique_question(category, difficulty, question_history, last_question=None, max_retries=5):
    difficulty_map = {0: 'Easy', 1: 'Medium', 2: 'Hard'}
    difficulty_str = difficulty_map.get(difficulty, 'Easy') # Get difficulty string from difficulty number or by default to 'Easy' if difficulty is out of range


    filtered_df = df[(df['Category'].str.strip() == category) & (df['Difficulty'].str.strip() == difficulty_str)]
    available_questions = filtered_df[~filtered_df.index.isin([q[0] for q in question_history])]

    if available_questions.empty:
        return None, None  # No more unique questions available

    if last_question is None or len(question_history) == 0:
        # If it's the first question or no last question, choose randomly
        selected_row = available_questions.sample(n=1).iloc[0]
    else:
        attempt = 0
        while attempt < max_retries:
            attempt += 1
            # Use LLaMA model to select the next best question
            prompt = f"""
                Given the following context and available questions, select next question:

                Last question asked: "{last_question}"
                Category: {category}
                Difficulty: {difficulty}

                Available questions:
                {available_questions['QuestionEn'].to_list()}

                Please respond with only the number of the best next question (1 for the first question, 2 for the second, etc
                If there are no more questions available, please respond with any question number available.
            """

            try:
                response = client.chat.completions.create(
                    model="llama3-8b-8192",  # Your chosen LLaMA model
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=10
                )
 
                response_content = response.choices[0].message.content.strip()

                # Debugging: Print the model's response to see what it is returning
                print(f"Attempt {attempt}: Model response: {response_content}")

                # Attempt to convert response to integer
                selected_index = int(response_content) - 1

                # Check if the selected index is within range
                if selected_index < 0 or selected_index >= len(available_questions):
                    raise ValueError("The selected index is out of range.")

                selected_row = available_questions.iloc[selected_index]
                return (selected_row['QuestionEn'], selected_row['Options'].split(','), selected_row['Ans']), selected_row.name

            except (ValueError, IndexError, TypeError) as e:
                print(f"Attempt {attempt}: Error: {e}")

            if attempt >= max_retries:
                print("Exceeded maximum retries. No more unique questions available. Ending quiz.")
                return None, None

    # If no last question or no retries needed, choose randomly
    selected_row = available_questions.sample(n=1).iloc[0]
    main_question = selected_row['QuestionEn']
    options = selected_row['Options'].split(',')
    random.shuffle(options)
    answer = selected_row['Ans']
    # print(f"Selected question: {main_question}")
    return (main_question, options, answer), int(selected_row.name)

# def generate_ai_enhanced_question(category, difficulty, question_history, last_question=None):

#     # First, get a question from the dataset
#     template_question_data, template_question_id = get_unique_question(category, difficulty, question_history, last_question)
#     # print("Question from dataset", template_question_data)

#     if template_question_data is None:
#         return None, None  # No more unique questions available

#     template_main_question, template_options, template_answer = template_question_data

#     # Now, use this as a template for the LLaMA model to generate a new question
#     prompt = f"""
#     Using the following question as a template, create a new, similar question in French with English translation:

#     Template Question: {template_main_question}
#     Template Options: {', '.join(template_options)}
#     Template Answer: {template_answer}

#     Create a new question that:
#     1. Is in the same category ({category}) and difficulty level ({difficulty}).
#     2. Has a similar structure but different content from the template.
#     3. Includes four options, with one correct answer.
#     4. Provides both French and English versions of the question and options.

#     Output format:
#     French Question: [Your generated question in French]
#     English Translation: [English translation of the question]
#     Options:
#     A. [Option 1 in French] (English: [English translation])
#     B. [Option 2 in French] (English: [English translation])
#     C. [Option 3 in French] (English: [English translation])
#     D. [Option 4 in French] (English: [English translation])
#     Correct Answer: [The letter of the correct option]
#     """

#     response = client.chat.completions.create(
#         model="llama3-8b-8192",  # Your chosen LLaMA model
#         messages=[{"role": "user", "content": prompt}],
#         max_tokens=300,
#         temperature=0.7
#     )

#     # Parse the response
#     content = response.choices[0].message.content.strip().split("\n")

#     # Initialize variables
#     french_question = ""
#     english_question = ""
#     french_options = []
#     english_options = []
#     correct_answer = ""

#     # Parse the content more robustly
#     for line in content:
#         if line.startswith("French Question:"):
#             french_question = line.split(":", 1)[1].strip()
#         elif line.startswith("English Translation:"):
#             english_question = line.split(":", 1)[1].strip()
#         elif line.startswith(("A.", "B.", "C.", "D.")):
#             parts = line.split("(English:", 1)
#             if len(parts) == 2:
#                 french_option = parts[0].split(".", 1)[1].strip()
#                 english_option = parts[1].strip().rstrip(")")
#                 french_options.append(french_option)
#                 english_options.append(english_option)
#         elif line.startswith("Correct Answer:"):
#             correct_answer = line.split(":", 1)[1].strip()

#     # Validate the parsed data
#     if not (french_question and english_question and len(french_options) == 4 and len(english_options) == 4 and correct_answer):
#         print("Warning: Unable to parse the AI response correctly. Using template question instead.")
#         return {
#             "french_question": template_main_question,
#             "english_question": template_main_question,
#             "french_options": template_options,
#             "english_options": template_options,
#             "correct_answer": template_answer
#         }, template_question_id
#     print("Ai Generated Question Function")
#     print(f"Generated French Question: {french_question}")
#     print(f"Generated Options: {french_options}")
#     print(f"Generated Correct Answer: {correct_answer}")

#     return {
#         "french_question": french_question,
#         "english_question": english_question,
#         "french_options": french_options,
#         "english_options": english_options,
#         "correct_answer": correct_answer
#     }, int(template_question_id)

def generate_ai_enhanced_question(category, difficulty, question_history, last_question=None):

    # First, get a question from the dataset
    template_question_data, template_question_id = get_unique_question(category, difficulty, question_history, last_question)

    if template_question_data is None:
        return None, None  # No more unique questions available

    template_main_question, template_options, template_answer = template_question_data

    # Now, use this as a template for the LLaMA model to generate a new question
    prompt = f"""
    Using the following question as a template, create a new, similar question in French with English translation:

    Template Question: {template_main_question}
    Template Options: {', '.join(template_options)}
    Template Answer: {template_answer}

    Create a new question that:
    1. Is in the same category ({category}) and difficulty level ({difficulty}).
    2. Has a similar structure but different content from the template.
    3. Includes four options, with one correct answer.
    4. Provides both French and English versions of the question and options.

    Output format:
    French Question: [Your generated question in French]
    English Translation: [English translation of the question]
    Options:
    A. [Option 1 in French] (English: [English translation])
    B. [Option 2 in French] (English: [English translation])
    C. [Option 3 in French] (English: [English translation])
    D. [Option 4 in French] (English: [English translation])
    Correct Answer: [The letter of the correct option]
    """

    response = client.chat.completions.create(
        model="llama3-8b-8192",  # Your chosen LLaMA model
        messages=[{"role": "user", "content": prompt}],
        max_tokens=250,
        temperature=0.5
    )

    # Parse the response
    content = response.choices[0].message.content.strip().split("\n")

    # Initialize variables
    french_question = ""
    english_question = ""
    french_options = []
    english_options = []
    correct_answer = ""

    # Parse the content more robustly
    for line in content:
        if line.startswith("French Question:"):
            french_question = line.split(":", 1)[1].strip()
        elif line.startswith("English Translation:"):
            english_question = line.split(":", 1)[1].strip()
        elif line.startswith(("A.", "B.", "C.", "D.")):
            parts = line.split("(English:", 1)
            if len(parts) == 2:
                french_option = parts[0].split(".", 1)[1].strip()
                english_option = parts[1].strip().rstrip(")")
                french_options.append(french_option)
                english_options.append(english_option)
        elif line.startswith("Correct Answer:"):
            correct_answer = line.split(":", 1)[1].strip()

    # Map the correct answer letter (A, B, C, D) to the actual answer
    letter_to_index = {'A': 0, 'B': 1, 'C': 2, 'D': 3}
    correct_answer_index = letter_to_index.get(correct_answer, None)

    if correct_answer_index is None or correct_answer_index >= len(french_options):
        print("Warning: Unable to parse the AI response correctly. Using template question instead.")
        return {
            "french_question": template_main_question,
            "english_question": template_main_question,
            "french_options": template_options,
            "english_options": template_options,
            "correct_answer": template_answer
        }, template_question_id

    # Get the actual correct answer content
    correct_answer_content = french_options[correct_answer_index]

    print("AI Generated Question Function")
    print(f"Generated French Question: {french_question}")
    print(f"Generated Options: {french_options}")
    print(f"Generated Correct Answer: {correct_answer_content}")

    return {
        "french_question": french_question,
        "english_question": english_question,
        "french_options": french_options,
        "english_options": english_options,
        "correct_answer": correct_answer_content
    }, int(template_question_id)


def generate_use_cases(question, options):
    options_str = ', '.join(options)

    prompt = (
        f"""
        To help the user prepare to answer the following question and make it easier for them as they are learning French, provide the output as a JSON object with the following structure:

        {{
            "title": "Provide an appropriate title for the topic you're teaching through the use cases.",
            "usecases": [
                {{
                    "example": "Provide a small question related to the components (verbs, nouns, or adjectives) of the main question.",
                    "answer": "Give the answer to the small question.",
                    "explanation": "Give a short explanation about why and how this answer is used in the context of the options."
                }},
                {{
                    "example": "Provide another similar use case.",
                    "answer": "Answer for the second use case.",
                    "explanation": "Explanation for the second use case."
                }},
                {{
                    "example": "Provide another similar use case.",
                    "answer": "Answer for the third use case.",
                    "explanation": "Explanation for the third use case."
                }}
            ],
            "conclusion": "Conclude by telling the user what they have learned and wish them the best for the upcoming question."
        }}

        DO NOT answer the main question directly. Just focus on the components and explain the options.

        Here are the answer options: {options_str}. Use these options to explain the use cases and their relevance.
        Question: {question}
        """
    )

    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama3-8b-8192",  # Your chosen LLaMA model
        response_format={"type": "json_object"}
    )

    # Get the raw response
    use_cases = chat_completion.choices[0].message.content.strip()

    # Use regex to extract the JSON portion
    json_match = re.search(r'(\{.*\})', use_cases, re.DOTALL)

    if json_match:
        json_str = json_match.group(1)  # Extract the JSON string
    else:
        raise ValueError("Failed to find a valid JSON in the response. Raw response was: " + use_cases)

    try:
        # Attempt to parse the extracted JSON string
        use_cases_json = json.loads(json_str)
    except json.JSONDecodeError:
        raise ValueError("Failed to decode JSON from the extracted response. Please check the output format. Raw JSON was: " + json_str)

    return use_cases_json  # Return the JSON object

def check_answer(user_answer, correct_answer):
    print("Check Answer Function")
    print(f"User's answer: {user_answer}, Correct answer: {correct_answer}")

    return user_answer.lower().strip() == correct_answer.lower().strip()

def print_performance_summary(user_performance, correct_answers, incorrect_answers):
    performance_summary = {
        'total_correct': correct_answers,
        'total_incorrect': incorrect_answers,
        'difficulties': {}
    }

    for difficulty, stats in user_performance.items():
        if stats['total'] > 0:
            accuracy = (stats['correct'] / stats['total']) * 100
            performance_summary['difficulties'][difficulty] = {
                'accuracy': f"{accuracy:.2f}%",
                'correct': stats['correct'],
                'total': stats['total']
            }

    return performance_summary

@app.route('/quiz', methods=['POST'])
def quiz():
    data = request.json
    category = data.get('category')
    action = data.get('action')
    state = data.get('quiz_state', {})  # Accept current state from the client

    if action == 'start':
        # Initialize the quiz state
        state = {
            'category': category,
            'difficulty': 'Easy',
            'question_history': [],
            'last_question': None,
            'correct_answers': 0,
            'incorrect_answers': 0,
            'streak': 0,
            'current_difficulty_index': 0,
            'total_questions': 0,
            'user_performance': {'Easy': {'correct': 0, 'total': 0}, 
                                 'Medium': {'correct': 0, 'total': 0}, 
                                 'Hard': {'correct': 0, 'total': 0}},
            'time_limits': {'Easy': 30, 'Medium': 20, 'Hard': 15},
            'adaptive_time_limits': {'Easy': 30, 'Medium': 20, 'Hard': 15}
        }
        return jsonify({'message': 'Quiz started', 'next_action': 'get_question', 'quiz_state': state})

    elif action == 'get_question':

        # print(state)

        difficulty_index = state['current_difficulty_index']

        question_data, question_id = generate_ai_enhanced_question(
            state['category'], difficulty_index, state['question_history'], state['last_question']
        )
        print("Question Data",question_data)

        if question_data is None:
            return jsonify({'message': 'No more questions available', 'quiz_ended': True, 'quiz_state': state})

        use_cases = generate_use_cases(question_data['english_question'], question_data['french_options'])

        state['current_question'] = {
            'id': question_id,
            'french_question': question_data['french_question'],
            'english_question': question_data['english_question'],
            'french_options': question_data['french_options'],
            'english_options': question_data['english_options'],
            'correct_answer': question_data['correct_answer'],
            'start_time': datetime.now().isoformat()
        }

        return jsonify({
            'use_cases': use_cases,
            'question': question_data['english_question'],
            'options': question_data['french_options'],
            'difficulty': ['Easy', 'Medium', 'Hard'][difficulty_index],
            'time_limit': state['adaptive_time_limits'][['Easy', 'Medium', 'Hard'][difficulty_index]],
            'next_action': 'submit_answer',
            'quiz_state': state
        })

    elif action == 'submit_answer':
        user_answer = data.get('answer')
        quiz_state = data.get('quiz_state')
        print("Quiz State: ", quiz_state)
        current_q = quiz_state['current_question']
        start_time_str = data.get('start_time')
        start_time = parser.isoparse(start_time_str)  # Handles the 'Z' (UTC) properly
        end_time = datetime.now(timezone.utc)
        time_taken = (end_time - start_time).total_seconds()

        difficulty = data.get('difficulty')

        if time_taken > state['adaptive_time_limits'][difficulty]:
            result = False
            message = "Time's up! You took too long to answer."
        else:
            result = check_answer(user_answer, current_q['correct_answer'])
            message = "Correct!" if result else f"Incorrect. The correct answer was: {current_q['correct_answer']}"

        # Update quiz state based on result
        if result:
            state['correct_answers'] += 1
            state['streak'] += 1
            state['user_performance'][difficulty]['correct'] += 1
            state['adaptive_time_limits'][difficulty] = max(state['time_limits'][difficulty] * 0.9, time_taken * 1.2)

            if state['streak'] >= 3 and state['current_difficulty_index'] < 2:
                state['current_difficulty_index'] += 1
                state['streak'] = 0
        else:
            state['incorrect_answers'] += 1
            state['streak'] = 0
            if state['current_difficulty_index'] > 0:
                state['current_difficulty_index'] -= 1

        state['user_performance'][difficulty]['total'] += 1
        state['total_questions'] += 1
        state['question_history'].append((current_q['id'], current_q['correct_answer']))
        state['last_question'] = current_q['english_question']

        return jsonify({
            'result': result,
            'message': message,
            'time_taken': time_taken,
            'next_action': 'get_question' if state['total_questions'] < 10 else 'end_quiz',
            'quiz_state': state
        })

    elif action == 'end_quiz':
        performance_summary = {
            'total_correct': state['correct_answers'],
            'total_incorrect': state['incorrect_answers'],
            'difficulties': {}
        }

        for difficulty, stats in state['user_performance'].items():
            if stats['total'] > 0:
                accuracy = (stats['correct'] / stats['total']) * 100
                performance_summary['difficulties'][difficulty] = {
                    'accuracy': f"{accuracy:.2f}%",
                    'correct': stats['correct'],
                    'total': stats['total']
                }

        return jsonify({
            'message': 'Quiz ended',
            'performance_summary': performance_summary,
            'quiz_state': state
        })

    else:
        return jsonify({'error': 'Invalid action'}, 400)

@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    try:
        data = request.get_json()
        text = data.get('text')
    # Generate the audio
        response = elevenlabs_client.text_to_speech.convert(
            voice_id="pMsXgVXv3BLzUgSXRplE",
            optimize_streaming_latency="0",
            output_format="mp3_22050_32",
            text=text,
            voice_settings=VoiceSettings(
                stability=0.1,
                similarity_boost=0.3,
                style=0.2,
            ),
            model_id="eleven_multilingual_v2",
        )

        return Response(
            response=response,
            content_type='audio/mpeg',
            headers={
                'Content-Disposition': 'inline; filename="output.mp3"'
            }
        )

    except Exception as e:
        print(f"An error occurred: {str(e)}")



if __name__ == '__main__':
    app.run(debug=True)
