/* tslint:disable:interface-over-type-literal */
import {Maybe} from 'tsmonad';
import {IHydraResponse} from '../HydraResponse';
import {IResource} from './Resource';

type LinkMap = {
    [key: string]: IResource[],
};

export type ManagesBlockPattern = {
    subject?: string | IResource,
    predicate?: string | (IRdfProperty & IResource),
    object?: string | (IClass & IResource),
};

export interface IApiDocumentation {
    classes: Class[];
    getClass(classId: string): Class;
    getOperations(classUri: string, predicateUri?: string): SupportedOperation[];
    getProperties(classUri: string): SupportedProperty[];

    /**
     * @deprecated
     */
    getEntrypoint(): Promise<IHydraResponse>;

    loadEntrypoint(): Promise<IHydraResponse>;
}

export interface IClass {
    /**
     * Gets the operations supported by this class
     */
    supportedOperations: SupportedOperation[];

    /**
     * Gets the properties supported by this class
     */
    supportedProperties: SupportedProperty[];
}

export interface IHydraResource {
    /**
     * Gets the operations which can be performed on this resource
     */
    readonly operations: IOperation[];
    /**
     * Gets the API Documentation which was linked to this resource representation
     */
    readonly apiDocumentation: Maybe<ApiDocumentation>;

    /**
     * Gathers all properties from all classes
     */
    getProperties(): IRdfProperty[];

    /**
     * Get all property/value pairs for hydra:Link properties
     *
     * @param includeMissing if true, will include properties not present in resource representation
     */
    getLinks(includeMissing?: boolean): LinkMap;

    /**
     * Gets objects of hydra:collection property
     */
    getCollections(filter?: ManagesBlockPattern): IResource[];
}

export interface IStatusCodeDescription {
    code: number;
    description: string;
}

export interface IDocumentedResource {
    title: string;
    description: string;
}

export interface ISupportedProperty {
    readable: boolean;
    writable: boolean;
    required: boolean;
    property: RdfProperty;
}

export interface ISupportedOperation {
    method: string;
    expects: Class;
    returns: Class;
    requiresInput: boolean;
}

export interface IRdfProperty {
    range: Class;
    domain: Class;
    supportedOperations: SupportedOperation[];
    isLink: boolean;
}

export interface IOperation {
    title: string;
    description: string;
    method: string;
    expects: Class;
    returns: Class;
    requiresInput: boolean;
    invoke(body: any, mediaType?: string);
}

export interface ICollection {
    /**
     * Gets the total number of items within the entire collection.
     * Note that this number can be larger then the number of `members` in the case of partial collections
     */
    readonly totalItems: number;
    /**
     * Gets the collection member included in the current representation.
     * In the case of partial collections they may only be a subset of all members
     */
    readonly members: HydraResource[];
    /**
     * Gets the views of a partial collection
     */
    readonly views?: IView[];
    /**
     * Gets the manages block for current collection
     */
    readonly manages: IManagesBlock[];
}

export interface IView {
    /**
     * Gets the actual collection resource, of which this view is part
     */
    readonly collection: HydraResource;
}

export interface IPartialCollectionView {
    /**
     * Gets the first page resource of a collection
     */
    readonly first: HydraResource;
    /**
     * Gets the previous page resource of a collection
     */
    readonly previous: HydraResource;
    /**
     * Gets the next page resource of a collection
     */
    readonly next: HydraResource;
    /**
     * Gets the last page resource of a collection
     */
    readonly last: HydraResource;
}

export type VariableRepresentation = 'BasicRepresentation' | 'ExplicitRepresentation';

export interface IIriTemplate {
    template: string;
    mappings: IIriTemplateMapping[];
    variableRepresentation: VariableRepresentation;
    expand(): string;
}

export interface IIriTemplateMapping {
    property: RdfProperty;
    variable: string;
    required: boolean;
}

/**
 * Represents the "manages block"
 */
export interface IManagesBlock {
    /**
     * Gets the subject resource from the manages block
     */
    subject: IResource;
    /**
     * Gets the predicate from the manages block
     */
    predicate: RdfProperty;
    /**
     * Gets the object class from the manages block
     */
    object: Class;

    /**
     * Checks if the current manages block matches the given pattern
     * @param filter {ManagesBlockPattern}
     */
    matches(filter: ManagesBlockPattern): boolean;
}

export type HydraResource = IHydraResource & IResource;
export type DocumentedResource = IDocumentedResource & HydraResource;
export type Class = IClass & DocumentedResource;
export type SupportedOperation = ISupportedOperation & DocumentedResource;
export type SupportedProperty = ISupportedProperty & DocumentedResource;
export type Collection = ICollection & HydraResource;
export type PartialCollectionView = IPartialCollectionView & IView & HydraResource;
export type RdfProperty = IRdfProperty & DocumentedResource;
export type ApiDocumentation = IApiDocumentation & IResource;
