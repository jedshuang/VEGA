package com.main;

import com.cli.ATutorialTerminal;

import bus.uigen.OEFrame;
import bus.uigen.ObjectEditor;
import util.models.TerminalModel;

public class CommandTerminalRunner {
    
    public static void main(String[] args) {
        // CommandTerminal ct = new ACommandTerminal();
        // OEFrame editor = ObjectEditor.edit(ct);
        // editor.refresh();
        TerminalModel terminal = new ATutorialTerminal();
		ObjectEditor.setDoPrints(false);
		OEFrame frame = ObjectEditor.edit(terminal);
		frame.setSize(600, 600);
    }
}
