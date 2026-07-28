const validateFiles = (documents, files) => {

    if (!files || files.length < 2) {

        return {
            valid: false,
            message: "Minimum two documents are required."
        };

    }

    if (documents.length !== files.length) {

        return {
            valid: false,
            message: "Documents data mismatch."
        };

    }

    return {
        valid: true
    };

};

export default validateFiles;