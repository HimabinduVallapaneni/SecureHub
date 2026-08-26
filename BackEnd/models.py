from sqlalchemy import Column, Integer, String, Text
from database import Base


class Finding(Base):
    __tablename__ = "findings"

    id = Column(Integer, primary_key=True, index=True)
    finding_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    application = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    status = Column(String, nullable=False)
    owner = Column(String, nullable=False)
    remediation_notes = Column(Text, nullable=True)

    retest_status = Column(
        String,
        nullable=False,
        default="Not Retested"
    )


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    owner = Column(String, nullable=False)
    criticality = Column(String, nullable=False)
    environment = Column(String, nullable=False)

    status = Column(
        String,
        nullable=False,
        default="Active"
    )

    description = Column(Text, nullable=True)


class SecurityException(Base):
    __tablename__ = "security_exceptions"

    id = Column(Integer, primary_key=True, index=True)

    exception_id = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    application = Column(String, nullable=False)
    finding_id = Column(String, nullable=True)
    owner = Column(String, nullable=False)
    reason = Column(Text, nullable=False)
    expiration_date = Column(String, nullable=False)

    status = Column(
        String,
        nullable=False,
        default="Pending"
    )


class AppSetting(Base):
    __tablename__ = "app_settings"

    id = Column(Integer, primary_key=True, index=True)

    app_name = Column(
        String,
        nullable=False,
        default="SecureHub"
    )

    default_severity = Column(
        String,
        nullable=False,
        default="Medium"
    )

    default_environment = Column(
        String,
        nullable=False,
        default="Development"
    )

    default_exception_days = Column(
        Integer,
        nullable=False,
        default=30
    )