import axios from "axios";
import { DocumentValidationResponse, ICreationResponse } from "../Interfaces/authDocument";
import { parseDate } from "../utils/parse";

export class DocumentService {

  constructor() {

  }

  async createValidation(country: string, document: string) {
    const apiKey: string = import.meta.env.VITE_API_KEY;
    const url: string = import.meta.env.VITE_API_URL;

    // Data in body
    const data = new URLSearchParams();
    data.append("type", "document-validation");
    data.append("country", country);
    data.append("document_type", document);
    data.append("user_authorized", "true");

    try {
      const response = await axios.post(
        `${url}/v1/validations`,
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "T####A-API-Key": apiKey,
          },
        }
      );

      return response.data as ICreationResponse
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Unexpected error occurred");
      }
    }


  }

  async retryValidation(prevValidation: DocumentValidationResponse){
    const apiKey: string = import.meta.env.VITE_API_KEY;
    const url: string = import.meta.env.VITE_API_URL;

    // Data in body
    const data = new URLSearchParams();
    data.append("type", "document-validation");
    data.append("country", prevValidation.validation_inputs.country);
    data.append("document_type", prevValidation.validation_inputs.document_type);
    data.append("user_authorized", "true");
    // Data to retry
    data.append("account_id", prevValidation.account_id);
    data.append("retry_of_id", prevValidation.validation_id);

    try {
      const response = await axios.post(
        `${url}/v1/validations`,
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "T####A-API-Key": apiKey,
          },
        }
      );

      return response.data as ICreationResponse
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Unexpected error occurred");
      }
    }
  }

  async uploadDocumentFront(binary: ArrayBuffer, content_type: string, sideUrl: string) {
    const url = import.meta.env.VITE_API_PROXY;

    const params = {
      content_type,
      url: sideUrl
    }

    try {
      const response = await axios.post(`${url}/upload`, binary, {
        params
      });
      return response.data
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Unexpected error occurred");
      }
    }
  }

  async getDocumentValidation(validation_id: string) {
    const url = import.meta.env.VITE_API_URL;
    const apiKey: string = import.meta.env.VITE_API_KEY;
    
    try {
      const res = await axios.get(`${url}/v1/validations/${validation_id}`,{
        params: {
          'show_details': true,
        },
        headers: {
          "T####A-API-Key": apiKey,
        }
      })
      const data: DocumentValidationResponse = res.data;
      data.creation_date = parseDate(data.creation_date)
      return data;
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Unexpected error occurred");
      }
    }
  }

}