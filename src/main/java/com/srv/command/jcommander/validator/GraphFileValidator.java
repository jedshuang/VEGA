package com.srv.command.jcommander.validator;

import com.beust.jcommander.IParameterValidator;
import com.beust.jcommander.ParameterException;

import java.io.File;

public class GraphFileValidator implements IParameterValidator {

    public void validate(String name, String value) throws ParameterException {
        File graphJsonFile = new File(value);
        if (!graphJsonFile.exists())
            throw new ParameterException(String.format("%s : %s : No such file", name, value));
        /*
        *  Additional checks here
        * */
    }
}
