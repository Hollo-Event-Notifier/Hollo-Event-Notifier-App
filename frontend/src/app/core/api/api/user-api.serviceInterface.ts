/**
 * Service Search App REST API documentation
 * This file holds the REST API documentation of the Hollo Event Notifier project.
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { HttpHeaders }                                       from '@angular/common/http';

import { Observable }                                        from 'rxjs';

import { UserCredentialsDto } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface UserApiServiceInterface {
    defaultHeaders: HttpHeaders;
    configuration: Configuration;

    /**
     * Logs user into the system
     * 
     * @param userCredentialsDto user credentials
     */
    loginUser(userCredentialsDto: UserCredentialsDto, extraHttpRequestParams?: any): Observable<{}>;

}
