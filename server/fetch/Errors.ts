export function EndpointNotFoundError() { return Response.json(
    {
        error: true,
        type: "ENDPOINT_NOT_FOUND",
    },
    { 
        status: 404 
    }
)};

export function InvalidMethodError(method: string) { return Response.json(
    {
        error: true,
        type: "MALFORMED_REQUEST",
        subType: "INVALID_METHOD",
        detail: `Method has to be '${method}'`
    },
    { 
        status: 405 
    }
)};


export function BodyMalformedError(reason: string) { return Response.json(
    {
        error: true,
        type: "MALFORMED_REQUEST",
        subType: "BODY_MALFORMED",
        detail: `Body is malformed because '${reason}'` 
    }, 
    { 
        status: 400
    }
)};

export function BodyFieldMissingError(field: string) { return Response.json(
    { 
        error: true, 
        type: "MALFORMED_REQUEST",
        subType: "BODY_FIELD_MISSING", 
        detail: `Body-Field '${field}' is required`
    },
    { 
        status: 400
    }
)};

export function BodyFieldInvalidTypeError(field: string, type: string) { return Response.json(
    {
        error: true,
        type: "MALFORMED_REQUEST",
        subType: "BODY_FIELD_INVALID_TYPE",
        detail: `Body-Field '${field}' has to be type '${type}'`
    },
    { 
        status: 400
    }
)};

export function BodyFieldMalformedError(field: string, reason: string) { return Response.json(
    { 
        error: true, 
        type: "MALFORMED_REQUEST", 
        subType: "BODY_FIELD_MALFORMED", 
        detail: `Body-Field '${field}' is malformed because '${reason}'` 
    }, 
    { 
        status: 400 
    }
)};

export function TargetNotFoundError(target: string) { return Response.json(
    { 
        error: true, 
        type: "TARGET_NOT_FOUND", 
        detail: `Target '${target}' not found` 
    }, 
    { 
        status: 404 
    }
)};

export function InvalidOperationError(reason: string) { return Response.json(
    { 
        error: true, 
        type: "INVALID_OPERATION", 
        detail: reason
    }, 
    { 
        status: 400 
    }
)};

export function NotAllowedError(reason: string) { return Response.json(
    { 
        error: true, 
        type: "NOT_ALLOWED", 
        detail: reason
    }, 
    { 
        status: 401 
    }
)};
