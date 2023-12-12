import { useTheme, Box, Typography } from '@mui/material';
import { Editor } from 'react-draft-wysiwyg';
import 'draft-js/dist/Draft.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useTranslation } from 'react-i18next';
import useThemeStore from 'clientStore/useThemeStore';
import EditorB from 'assets/editor/B.svg';
import EditorI from 'assets/editor/I.svg';
import EditorU from 'assets/editor/U.svg';
import AlignLeft from 'assets/editor/alignLeft.svg';
import AlignCenter from 'assets/editor/alignCenter.svg';
import AlignRight from 'assets/editor/alignRight.svg';
import AlignJustify from 'assets/editor/alignJustify.svg';
import List from 'assets/editor/list.svg';

const styles = {
  root: {
    '& .rdw-option-wrapper': {
      width: 24,
      height: 24,
      backgroundColor: (theme) => theme.palette.grey[0],
      border: 0,
      borderRadius: '4px',
      transition: 'all .2s',
      '&:hover': {
        boxShadow: 'none',
        transform: `scale(1.05)`
      }
    },
    '& .rdw-text-align-wrapper': {
      order: 4,
      '&:last-child': {
        mr: 0
      }
    },
    '& .rdw-editor-toolbar': {
      px: 0
    },
    '& .rdw-inline-wrapper': {
      order: 2
    },
    '& .rdw-list-wrapper': {
      order: 3
    }
  },
  'public-DraftEditor-content': {
    minHeight: '300px',
    paddingLeft: '10px',
    borderRadius: '6px'
  }
};

const CustomButton = ({ label }) => (
  <Typography
    variant="subtitle"
    sx={{ order: 1, mr: 'auto', fontSize: '24px', fontWeight: 'bold' }}>
    {label}
  </Typography>
);

const MyEditor = ({ value, onChange, label, readOnly = false }) => {
  const theme = useTheme();
  const { mode } = useThemeStore();
  const { t } = useTranslation();
  return (
    <Box sx={styles.root}>
      <Editor
        placeholder={`${t('Notes')}...`}
        toolbarStyle={{
          display: 'flex',
          justifyContent: 'end',
          backgroundColor: theme.palette.background.secondary,
          border: 'none',
          pr: 0
        }}
        toolbarCustomButtons={[<CustomButton label={label} key="cutom" />]}
        editorStyle={{
          ...styles['public-DraftEditor-content'],
          alignItems: 'center',
          backgroundColor: theme.palette.grey[mode === 'light' ? 200 : 0]
        }}
        editorState={value}
        onEditorStateChange={onChange}
        readOnly={readOnly}
        toolbar={{
          options: ['inline', 'list', 'textAlign'],
          inline: {
            options: ['bold', 'italic', 'underline'],
            bold: { icon: EditorB },
            italic: { icon: EditorI },
            underline: { icon: EditorU }
          },
          list: {
            options: ['ordered'],
            ordered: {
              icon: List
            }
          },
          textAlign: {
            left: {
              icon: AlignLeft
            },
            center: {
              icon: AlignCenter
            },
            right: {
              icon: AlignRight
            },
            justify: {
              icon: AlignJustify
            }
          }
        }}
        // {...props}
      />
    </Box>
  );
};

export default MyEditor;
