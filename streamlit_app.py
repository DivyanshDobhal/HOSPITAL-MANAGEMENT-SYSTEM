import os

import streamlit as st
from pymongo import MongoClient


@st.cache_resource
def get_db():
    """Connect to MongoDB Atlas and return the hospital database.

    Uses MONGODB_URI from environment variables or Streamlit secrets.
    """
    uri = os.environ.get("MONGODB_URI")
    if not uri and "MONGODB_URI" in st.secrets:
        uri = st.secrets["MONGODB_URI"]

    if not uri:
        st.error(
            "MONGODB_URI is not set. Configure it as an environment variable or in Streamlit secrets."
        )
        st.stop()

    client = MongoClient(uri)
    # If URI includes a default database (e.g. .../hospital), use that
    db = client.get_default_database() or client["hospital"]
    return db


def main():
    st.set_page_config(page_title="Hospital Management Dashboard", layout="wide")
    st.title("🏥 Hospital Management System - Streamlit Dashboard")

    db = get_db()

    # Sidebar navigation
    section = st.sidebar.selectbox(
        "Select section",
        [
            "Overview",
            "Users",
            "Doctors",
            "Patients",
            "Appointments",
            "Prescriptions",
        ],
    )

    if section == "Overview":
        st.subheader("Overview")
        col1, col2, col3, col4 = st.columns(4)

        users_count = db["users"].count_documents({})
        doctors_count = db["doctors"].count_documents({})
        patients_count = db["patients"].count_documents({})
        appointments_count = db["appointments"].count_documents({})

        col1.metric("Users", users_count)
        col2.metric("Doctors", doctors_count)
        col3.metric("Patients", patients_count)
        col4.metric("Appointments", appointments_count)

        st.caption("Showing counts from the 'hospital' MongoDB database.")

    elif section == "Users":
        st.subheader("Users")
        docs = list(db["users"].find({}, {"password": 0}).limit(100))
        if docs:
            st.dataframe(docs, use_container_width=True)
        else:
            st.info("No users found.")

    elif section == "Doctors":
        st.subheader("Doctors")
        docs = list(db["doctors"].find({}).limit(100))
        if docs:
            st.dataframe(docs, use_container_width=True)
        else:
            st.info("No doctors found.")

    elif section == "Patients":
        st.subheader("Patients")
        docs = list(db["patients"].find({}).limit(100))
        if docs:
            st.dataframe(docs, use_container_width=True)
        else:
            st.info("No patients found.")

    elif section == "Appointments":
        st.subheader("Appointments")
        docs = list(
            db["appointments"].find({}, {"notes": 0}).sort("appointmentDate", -1).limit(100)
        )
        if docs:
            st.dataframe(docs, use_container_width=True)
        else:
            st.info("No appointments found.")

    elif section == "Prescriptions":
        st.subheader("Prescriptions")
        docs = list(db["prescriptions"].find({}).limit(100))
        if docs:
            st.dataframe(docs, use_container_width=True)
        else:
            st.info("No prescriptions found.")


if __name__ == "__main__":
    main()
