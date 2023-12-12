/* eslint-disable no-debugger */
import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Box, Stack, Typography, FormLabel } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import get from 'lodash.get';
import { httpDeleteFile, httpPostUpload } from 'data/upload';
import { FileUploader } from 'react-drag-drop-files';
import notification from 'services/notification';
import { useTranslation } from 'react-i18next';
import HorizontalWrapper from './HorizontalWrapper';
import FileWidget from './FileWidget';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';

const isFile = (evt) => {
  const dt = evt.dataTransfer;

  for (let i = 0; i < dt.types.length; i++) {
    if (dt.types[i] === 'Files') {
      return true;
    }
  }
  return false;
};

const createOverlay = () => {
  const overlay = document.createElement('div');
  const text = document.createElement('p');

  text.textContent = 'Drop Anywhere' + '!';

  overlay.append(text);
  overlay.setAttribute('id', 'overlay');
  overlay.classList.add('overlay');

  return overlay;
};

const openLayer = () => {
  const div = document.getElementById('overlay');
  div.classList.add('overlay-in');
};

const removeLayer = () => {
  const div = document.getElementById('overlay');
  div.classList.remove('overlay-in');
};

const EmptyDropzone = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Stack alignItems="center" justifyContent="center" height="100%">
      <FontAwesomeIcon
        icon={faCloudArrowUp}
        size="5x"
        color={theme.palette.common.icon.secondary}
      />
      <Typography
        sx={{ color: theme.palette.grey[200] }}
        children={t('Drag & Drop file to upload')}
      />
      <Typography color={'primary.main'} children={t('or browse')} />
    </Stack>
  );
};

const FullDropzone = ({ reset, children }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <HorizontalWrapper
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        position: 'relative'
      }}>
      <Typography sx={{ color: theme.palette.primary.main }} children={`${t('Select files')}...`} />
    </HorizontalWrapper>
  );
};

const MyFileUploader = ({
  value,
  onChange,
  multiple = true,
  remove,
  append,
  readOnly = false,
  reset,
  ...props
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const lastTargetRef = useRef(null);
  const [files, setFiles] = useState(() => value);

  const mutate = useMutation(httpPostUpload, {
    onSuccess: ({ data: { data } }) => {
      setFiles((prev) => [...prev, data]);
      append(data);
    },
    onError: (error) => {
      notification
        .setMessage(get(error, 'response.data.error.message'), t('Unexpected server error'))
        .setMode('error')
        .pop();
    }
  });

  const deleteMutate = useMutation(httpDeleteFile, {
    onSuccess: () => {
      notification.setMode('success').setMessage(t('Deleted successfully')).pop();
    },
    onError: () => {
      notification.setMode('error').setMessage(t('Deleted unsuccessfully')).pop();
    }
  });

  const handleDeleteFile = async (i) => {
    const selectedFile = files[i];

    await deleteMutate.mutateAsync(selectedFile.id);

    remove(i);

    const newList = files.slice(0, i).concat(files.slice(i + 1, files.length));

    setFiles(newList);
  };

  const handleChange = async (files) => {
    const formData = new FormData();
    formData.append('file', files[0]);
    mutate.mutate(formData);
  };

  const handleWindowDragEnter = (e) => {
    if (isFile(e)) {
      lastTargetRef.current = e.target;
      openLayer();
    }
  };
  const handleWindowDrop = (e) => {
    e.preventDefault();

    removeLayer();

    if (e.dataTransfer.files.length == 1) {
      handleChange(e.dataTransfer.files);
    }
  };

  const resetFiles = () => {
    reset && reset();
    setFiles([]);
  };

  const handleWindowDragLeave = (e) => {
    e.preventDefault();

    if (e.target === lastTargetRef.current || e.target === document) {
      removeLayer();
    }
  };

  const handlePaste = (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;

    // Loop through items to find files
    for (const item of items) {
      if (item.kind === 'file') {
        const file = item.getAsFile();

        handleChange([file]);
      }
    }
  };

  const handleWindowDragOver = (e) => e.preventDefault();

  useEffect(() => {
    const overlay = createOverlay();

    document.body.append(overlay);

    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('dragenter', handleWindowDragEnter);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('drop', handleWindowDrop);
    window.addEventListener('paste', handlePaste);

    return () => {
      overlay.remove();

      window.removeEventListener('keydown', handlePaste);
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('dragenter', handleWindowDragEnter);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, []);

  return (
    <Stack
      sx={{
        height: '100%',
        borderRadius: '10px',
        backgroundColor: 'background.secondary',
        '&>label[for=attachments]': {
          maxWidth: '100%',
          height: '100%',
          borderColor: (theme) => theme.palette.border.form,
          '&>svg>path': {
            fill: (theme) => theme.palette.primary.main
          }
        }
      }}
      direction="column"
      rowGap={0}>
      <FormLabel
        sx={{
          fontSize: '24px',
          fontWeight: 'bold',
          height: '53px',
          display: 'flex',
          alignItems: 'center'
        }}>
        {t('Attached Files')}
      </FormLabel>
      <Box
        sx={{
          borderStyle: 'dashed',
          flex: 1,
          p: 1,
          borderColor: (theme) => theme.palette.grey[200],
          borderRadius: '10px',
          position: 'relative'
        }}>
        <FileUploader
          children={
            files.length ? (
              <>
                <FullDropzone reset={reset}></FullDropzone>
              </>
            ) : (
              <EmptyDropzone />
            )
          }
          {...props}
          multiple={multiple}
          value={value}
          handleChange={handleChange}
        />
        {files.length > 0 && (
          <Typography
            sx={{
              pointerEvents: 'auto',
              color: theme.palette.error.light,
              position: 'absolute',
              right: '22px',
              top: '13%',
              transform: 'translateY(-50%)',
              cursor: 'pointer'
            }}
            children={t('Clear all')}
            onClick={resetFiles}
          />
        )}

        <Stack mt={1} flexWrap="wrap" direction="row" columnGap={'8px'} rowGap={'8px'}>
          {files.map((file, i) => (
            <FileWidget
              key={file.id}
              {...file}
              handleDeleteFile={handleDeleteFile}
              index={i}
              readOnly={readOnly}
            />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};

export default MyFileUploader;
