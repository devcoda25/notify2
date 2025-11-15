import React, { useEffect, useMemo, useState } from 'react';
import { SNIPPETS } from './snippets.js';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { autocompletion } from '@codemirror/autocomplete';

import { safeEval, defaultHelpers } from './evaluator/safeEval.js';
import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';

const BASE_HELPERS = [
    { name: 'len', signature: 'len(text|array)', doc: 'Length of string or array' },
    { name: 'includes', signature: 'includes(text, part)', doc: 'Substring check' },
    { name: 'startsWith', signature: 'startsWith(text, part)' },
    { name: 'endsWith', signature: 'endsWith(text, part)' },
    { name: 'regex', signature: 'regex(pattern, flags)', doc: 'Build a RegExp' },
    { name: 'inList', signature: 'inList(x, list)' },
    { name: 'minutesSince', signature: 'minutesSince(isoDate)' },
    { name: 'toLower', signature: 'toLower(text)' },
    { name: 'toUpper', signature: 'toUpper(text)' }
];

export default function ExpressionBuilder({
    value,
    onChange,
    variables = [],
    initialTestContext,
    helpers = [],
    height = 160,
    readOnly = false,
    className
}) {
    const allHelpers = useMemo(() => [...BASE_HELPERS, ...helpers], [helpers]);

    const completions = useMemo(() => {
        return (context) => {
            let word = context.matchBefore(/\w*/);
            if (word && word.from === word.to && !context.explicit) return null;

            const variableOptions = variables.map(v => ({ label: v.name, type: 'variable', detail: v.label, info: v.type }));
            const helperOptions = allHelpers.map(h => ({ label: h.name, type: 'function', detail: h.signature, info: h.doc }));
            const snippetOptions = SNIPPETS.map(s => ({ label: s.label, type: 'snippet', apply: s.apply, detail: 'snippet' }));

            return {
                from: word ? word.from : context.pos,
                options: [...variableOptions, ...helperOptions, ...snippetOptions]
            };
        };
    }, [variables, allHelpers]);

    const [testOpen, setTestOpen] = useState(false);
    const [testJson, setTestJson] = useState(() => JSON.stringify(initialTestContext ?? {}, null, 2));
    const [testResult, setTestResult] = useState('');

    function insert(text) {
        onChange(value + text);
    }

    function onInsertVariable(name) {
        if (!name) return;
        insert(name);
    }

    function onInsertSnippet(code) {
        if (!code) return;
        insert(code);
    }

    function onTest() {
        try {
            const ctx = testJson.trim() ? JSON.parse(testJson) : {};
            const lib = defaultHelpers();
            const result = safeEval(value || 'null', ctx, lib);
            setTestResult(String(result));
        } catch (e) {
            setTestResult(`Error: ${e?.message || String(e)}`);
        }
    }

    useEffect(() => {
        function onKey(e) {
            const isMac = navigator.platform.toUpperCase().includes('MAC');
            const mod = isMac ? e.metaKey : e.ctrlKey;
            if (mod && e.key.toLowerCase() === 'enter') {
                e.preventDefault();
                setTestOpen(true);
                onTest();
            }
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [value, testJson]);

    return (
        <Paper variant="outlined" sx={{ p: 1.25, display: 'grid', gap: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Variable</InputLabel>
                    <Select onChange={(e) => onInsertVariable(e.target.value)} label="Variable" defaultValue="">
                        {variables.map(v => <MenuItem key={v.name} value={v.name}>{v.label ? `${v.label} — ` : ''}{v.name}</MenuItem>)}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Snippet</InputLabel>
                    <Select onChange={(e) => onInsertSnippet(e.target.value)} label="Snippet" defaultValue="">
                        {SNIPPETS.map(s => <MenuItem key={s.label} value={s.apply}>{s.label}</MenuItem>)}
                    </Select>
                </FormControl>

                <Button size="small" variant="outlined" onClick={() => { setTestOpen((o) => !o) }}>
                    {testOpen ? 'Hide Test' : 'Test (⌘/Ctrl+Enter)'}
                </Button>
            </Stack>

            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
                <CodeMirror
                    value={value}
                    height={`${height}px`}
                    extensions={[javascript(), autocompletion({ override: [completions] })]}
                    onChange={(val) => onChange(val)}
                    theme={oneDark}
                    readOnly={readOnly}
                />
            </Paper>

            <Box>
                <Typography variant="caption" color="text.secondary">Ctrl+Space for suggestions</Typography>
            </Box>

            {testOpen && (
                <Grid container spacing={1} alignItems="flex-start">
                    <Grid item xs={12} md={8}>
                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            value={testJson}
                            onChange={(e) => setTestJson(e.target.value)}
                            placeholder='{"country":"US","age":19,"message":"hello"}'
                            sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: 12 } }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ display: 'grid', gap: 1 }}>
                        <Button onClick={onTest} variant="contained">Run Test</Button>
                        <Paper variant="outlined" sx={{ p: '6px 8px', minHeight: 38, display: 'grid', alignItems: 'center', backgroundColor: 'grey.100', wordBreak: 'break-all' }}>
                            <Typography variant="caption">{testResult || 'Result will appear here'}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Paper>
    );
}
