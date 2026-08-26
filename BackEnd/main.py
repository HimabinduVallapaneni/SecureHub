from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import (
    Finding,
    Application,
    SecurityException,
    AppSetting,
)


app = FastAPI(
    title="SecureHub API",
    description="Cloud-Native Security Findings Management Platform",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)


class FindingCreate(BaseModel):
    finding_id: str
    title: str
    application: str
    severity: str
    status: str
    owner: str


class FindingUpdate(BaseModel):
    status: str
    remediation_notes: str
    retest_status: str


class ApplicationCreate(BaseModel):
    name: str
    owner: str
    criticality: str
    environment: str
    status: str
    description: str = ""


class ExceptionCreate(BaseModel):
    exception_id: str
    application: str
    finding_id: str = ""
    owner: str
    reason: str
    expiration_date: str
    status: str


class ExceptionUpdate(BaseModel):
    status: str


class SettingsUpdate(BaseModel):
    app_name: str
    default_severity: str
    default_environment: str
    default_exception_days: int


@app.get("/")
def root():
    return {
        "message": "SecureHub API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.get("/api/findings")
def get_findings(
    db: Session = Depends(get_db),
):
    findings = db.query(Finding).all()

    return [
        {
            "id": finding.finding_id,
            "title": finding.title,
            "application": finding.application,
            "severity": finding.severity,
            "status": finding.status,
            "owner": finding.owner,
            "remediation_notes": finding.remediation_notes,
            "retest_status": finding.retest_status,
        }
        for finding in findings
    ]


@app.post("/api/findings")
def create_finding(
    finding_data: FindingCreate,
    db: Session = Depends(get_db),
):
    existing = (
        db.query(Finding)
        .filter(Finding.finding_id == finding_data.finding_id)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Finding ID already exists",
        )

    new_finding = Finding(
        finding_id=finding_data.finding_id,
        title=finding_data.title,
        application=finding_data.application,
        severity=finding_data.severity,
        status=finding_data.status,
        owner=finding_data.owner,
        remediation_notes="",
        retest_status="Not Retested",
    )

    db.add(new_finding)
    db.commit()

    return {
        "message": "Finding created successfully"
    }


@app.put("/api/findings/{finding_id}")
def update_finding(
    finding_id: str,
    update_data: FindingUpdate,
    db: Session = Depends(get_db),
):
    finding = (
        db.query(Finding)
        .filter(Finding.finding_id == finding_id)
        .first()
    )

    if not finding:
        raise HTTPException(
            status_code=404,
            detail="Finding not found",
        )

    finding.status = update_data.status
    finding.remediation_notes = update_data.remediation_notes
    finding.retest_status = update_data.retest_status

    db.commit()

    return {
        "message": "Finding updated successfully"
    }


@app.delete("/api/findings/{finding_id}")
def delete_finding(
    finding_id: str,
    db: Session = Depends(get_db),
):
    finding = (
        db.query(Finding)
        .filter(Finding.finding_id == finding_id)
        .first()
    )

    if not finding:
        raise HTTPException(
            status_code=404,
            detail="Finding not found",
        )

    db.delete(finding)
    db.commit()

    return {
        "message": "Finding deleted successfully"
    }


@app.get("/api/applications")
def get_applications(
    db: Session = Depends(get_db),
):
    applications = db.query(Application).all()

    return [
        {
            "id": application.id,
            "name": application.name,
            "owner": application.owner,
            "criticality": application.criticality,
            "environment": application.environment,
            "status": application.status,
            "description": application.description,
        }
        for application in applications
    ]


@app.post("/api/applications")
def create_application(
    application_data: ApplicationCreate,
    db: Session = Depends(get_db),
):
    existing = (
        db.query(Application)
        .filter(Application.name == application_data.name)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Application already exists",
        )

    new_application = Application(
        name=application_data.name,
        owner=application_data.owner,
        criticality=application_data.criticality,
        environment=application_data.environment,
        status=application_data.status,
        description=application_data.description,
    )

    db.add(new_application)
    db.commit()

    return {
        "message": "Application created successfully"
    }


@app.delete("/api/applications/{application_id}")
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
):
    application = (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    db.delete(application)
    db.commit()

    return {
        "message": "Application deleted successfully"
    }


@app.get("/api/exceptions")
def get_exceptions(
    db: Session = Depends(get_db),
):
    exceptions = db.query(SecurityException).all()

    return [
        {
            "id": exception.exception_id,
            "application": exception.application,
            "finding_id": exception.finding_id,
            "owner": exception.owner,
            "reason": exception.reason,
            "expiration_date": exception.expiration_date,
            "status": exception.status,
        }
        for exception in exceptions
    ]


@app.post("/api/exceptions")
def create_exception(
    exception_data: ExceptionCreate,
    db: Session = Depends(get_db),
):
    existing = (
        db.query(SecurityException)
        .filter(
            SecurityException.exception_id
            == exception_data.exception_id
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Exception ID already exists",
        )

    new_exception = SecurityException(
        exception_id=exception_data.exception_id,
        application=exception_data.application,
        finding_id=exception_data.finding_id,
        owner=exception_data.owner,
        reason=exception_data.reason,
        expiration_date=exception_data.expiration_date,
        status=exception_data.status,
    )

    db.add(new_exception)
    db.commit()

    return {
        "message": "Security exception created successfully"
    }


@app.put("/api/exceptions/{exception_id}")
def update_exception(
    exception_id: str,
    update_data: ExceptionUpdate,
    db: Session = Depends(get_db),
):
    exception = (
        db.query(SecurityException)
        .filter(
            SecurityException.exception_id == exception_id
        )
        .first()
    )

    if not exception:
        raise HTTPException(
            status_code=404,
            detail="Exception not found",
        )

    exception.status = update_data.status
    db.commit()

    return {
        "message": "Security exception updated successfully"
    }


@app.delete("/api/exceptions/{exception_id}")
def delete_exception(
    exception_id: str,
    db: Session = Depends(get_db),
):
    exception = (
        db.query(SecurityException)
        .filter(
            SecurityException.exception_id == exception_id
        )
        .first()
    )

    if not exception:
        raise HTTPException(
            status_code=404,
            detail="Exception not found",
        )

    db.delete(exception)
    db.commit()

    return {
        "message": "Security exception deleted successfully"
    }


@app.get("/api/settings")
def get_settings(
    db: Session = Depends(get_db),
):
    settings = db.query(AppSetting).first()

    if not settings:
        settings = AppSetting(
            app_name="SecureHub",
            default_severity="Medium",
            default_environment="Development",
            default_exception_days=30,
        )

        db.add(settings)
        db.commit()
        db.refresh(settings)

    return {
        "app_name": settings.app_name,
        "default_severity": settings.default_severity,
        "default_environment": settings.default_environment,
        "default_exception_days": settings.default_exception_days,
    }


@app.put("/api/settings")
def update_settings(
    settings_data: SettingsUpdate,
    db: Session = Depends(get_db),
):
    settings = db.query(AppSetting).first()

    if not settings:
        settings = AppSetting()
        db.add(settings)

    settings.app_name = settings_data.app_name
    settings.default_severity = settings_data.default_severity
    settings.default_environment = settings_data.default_environment
    settings.default_exception_days = settings_data.default_exception_days

    db.commit()

    return {
        "message": "Settings updated successfully"
    }