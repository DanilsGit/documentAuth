export enum AllowedCountries {
    CO = "CO",
    CL = "CL",
    MX = "MX",
    PE = "PE",
    ALL = "ALL",
    BR = "BR",
    CR = "CR",
    VE = "VE",
    PA = "PA"
}

export enum DocumentTypes {
    NationalId = "national-id",
    Passport = "passport",
    ForeignId = "foreign-id",
    Pep = "pep",
    Ppt = "ppt",
    DriverLicense = "driver-license",
    Invoice = "invoice",
    IdentityCard = "identity-card"
}

export interface ICreationResponse {
    validation_id: string;
    ip_address: string;
    account_id: string;
    type: string;
    validation_status: string;
    creation_date: string;
    instructions: instructions;
    remaining_retries: number;
  }

interface instructions {
    front_url: string;
    reverse_url?: string;
}

export type route_validator = "CREATE" | "UPLOAD" | "DONE"


interface AttachmentValidation {
    attachment_type: string;
    result: string;
    validation_name: string;
    validation_type: string;
    declined_reason?: string;
  }
  
  interface DocumentDetails {
    document_type: string;
    country: string;
  }
  
  interface UserResponse {
    input_files: string[];
}

export interface DocumentValidationResponse {
    account_id: string;
    allowed_retries: number;
    attachment_status: string;
    attachment_validations: AttachmentValidation[];
    creation_date: string;
    declined_reason: string;
    details: { document_details: DocumentDetails };
    failure_status: string;
    ip_address: string;
    processing_finish_date: string;
    processing_start_date: string;
    remaining_retries: number;
    type: string;
    user_response: UserResponse;
    validation_id: string;
    validation_inputs: {
      country: string;
      document_type: string;
    };
    validation_status: string;
  }
