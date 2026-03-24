import streamlit as st
import requests

# 🔗 HuggingFace backend
BACKEND_URL = "https://your-app.hf.space"

st.set_page_config(page_title="PathFinder", layout="centered")

# ─────────────────────────────────────────────
# STATE
# ─────────────────────────────────────────────
if "step" not in st.session_state:
    st.session_state.step = 0
    st.session_state.answers = {}
    st.session_state.results = None
    st.session_state.main_idx = 0

# ─────────────────────────────────────────────
# QUESTIONS
# ─────────────────────────────────────────────
QUESTIONS = [
    {"id": "degree", "label": "What are you studying?"},
    {"id": "college", "label": "College type", "options": ["Tier 3", "Tier 2", "Tier 1"]},
    {"id": "percentage", "label": "Percentage / CGPA"},
    {"id": "interests", "label": "Interests", "multi": True,
     "options": ["Coding", "Design", "Teaching", "Problem Solving"]},
    {"id": "strengths", "label": "Strengths", "multi": True,
     "options": ["Communication", "Coding", "Math", "Creativity"]},
    {"id": "location", "label": "Location"},
]

# ─────────────────────────────────────────────
# BACKEND CALL
# ─────────────────────────────────────────────
def call_backend(profile):
    res = requests.post(f"{BACKEND_URL}/api", json={"profile": profile})
    return res.json()

# ─────────────────────────────────────────────
# QUIZ
# ─────────────────────────────────────────────
def show_quiz():
    st.title("🎯 PathFinder")

    step = st.session_state.step
    q = QUESTIONS[step]

    st.subheader(f"Q{step+1}/{len(QUESTIONS)}")
    st.write(q["label"])

    if "options" in q and q.get("multi"):
        val = st.multiselect("", q["options"],
                             default=st.session_state.answers.get(q["id"], []))
    elif "options" in q:
        val = st.selectbox("", q["options"])
    else:
        val = st.text_input("")

    col1, col2 = st.columns(2)

    if col1.button("Back") and step > 0:
        st.session_state.step -= 1

    if col2.button("Next"):
        if val:
            st.session_state.answers[q["id"]] = val

            if step < len(QUESTIONS) - 1:
                st.session_state.step += 1
            else:
                with st.spinner("Analyzing..."):
                    st.session_state.results = call_backend(st.session_state.answers)

# ─────────────────────────────────────────────
# TABS
# ─────────────────────────────────────────────
def tab_main(p):
    st.subheader(p["career_title"])
    st.write(p["day_to_day"])
    st.write("💰", p["starting_salary"])
    st.write("📅", p["timeline_weeks"], "weeks")

def tab_roadmap(p):
    st.subheader("Roadmap")
    for i, s in enumerate(p["skills_to_learn"], 1):
        st.write(f"Week {i}: {s}")

def tab_skills(p):
    for s in p["skills_to_learn"]:
        with st.expander(s):
            st.write("Learn via YouTube / Free courses")

def tab_resume():
    name = st.text_input("Name")
    if st.button("Generate"):
        st.success("Resume created!")

def tab_chat():
    msg = st.text_input("Ask AI")

    if st.button("Send"):
        res = requests.post(f"{BACKEND_URL}/chat", json={"message": msg})
        st.write(res.json()["response"])

# ─────────────────────────────────────────────
# RESULTS
# ─────────────────────────────────────────────
def show_results():
    st.title("Your Career Paths")

    results = st.session_state.results["results"]

    idx = st.selectbox(
        "Choose Path",
        range(len(results)),
        format_func=lambda x: results[x]["career_title"]
    )

    p = results[idx]

    tabs = st.tabs(["Main", "Roadmap", "Skills", "Resume", "Chat"])

    with tabs[0]:
        tab_main(p)
    with tabs[1]:
        tab_roadmap(p)
    with tabs[2]:
        tab_skills(p)
    with tabs[3]:
        tab_resume()
    with tabs[4]:
        tab_chat()

    if st.button("Restart"):
        st.session_state.step = 0
        st.session_state.answers = {}
        st.session_state.results = None

# ─────────────────────────────────────────────
# FLOW
# ─────────────────────────────────────────────
if st.session_state.results is None:
    show_quiz()
else:
    show_results()
