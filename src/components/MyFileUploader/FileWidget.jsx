/* eslint-disable no-debugger */
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@mui/material/styles';
import { Box, Stack, Typography, IconButton } from '@mui/material';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import { httpGetFile } from 'data/upload';
import styles from './MyFileUploader.styles';
import { globalStyles } from 'theme/globalStyles';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useTranslation } from 'react-i18next';
import ImagePreview from './ImagePreview';
import { formatFileSize } from 'utils/helpers';
import HorizontalWrapper from './HorizontalWrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

function FileWidget({
  originalName,
  filePath,
  index,
  id,
  size,
  handleDeleteFile,
  sx,
  readOnly = false
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [openPreview, setOpenPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const downloadMutation = useQuery({
    queryKey: ['upload', filePath],
    queryFn: async () => await httpGetFile(id),
    enabled: false
  });

  const togglePreviewDialog = () => setOpenPreview((prev) => !prev);

  const getFileUrl = async () => {
    const res = await downloadMutation.refetch();

    // Assume you have buffer data in the form of a Uint8Array
    const bufferData = new Uint8Array(res?.data?.data?.data);

    // Create a Blob from the buffer data
    const blob = new Blob([bufferData]);

    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    return url;
  };

  const download = async () => {
    const url = await getFileUrl();
    // Create an anchor element
    const a = document.createElement('a');
    a.href = url;

    // Set the filename and extension for the downloaded file
    a.download = originalName; // Replace with the appropriate extension
    // Trigger a click event on the anchor element to initiate the download
    a.click();

    // Clean up by revoking the temporary URL
    URL.revokeObjectURL(url);
  };

  const preview = async () => {
    togglePreviewDialog();
    setPreviewUrl(await getFileUrl());
  };
  return (
    <>
      <HorizontalWrapper sx={[styles.fileWidget, ...(Array.isArray(sx) ? sx : [sx])]}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          mr={'12px'}
          sx={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: 'primary.main' }}>
          <InsertDriveFileRoundedIcon />
        </Box>
        <Stack width={'calc(100% - 90px)'}>
          <Typography
            variant="subtitle2"
            sx={[{ color: 'common.white' }, globalStyles.ellipsis(1)]}
            children={originalName}
          />
          <Typography
            sx={{ color: 'common.alert.success.color' }}
            children={`${t('File successfully uploaded')} (${formatFileSize(size)})`}
          />
        </Stack>
        {!readOnly ? (
          <IconButton
            onClick={() => handleDeleteFile(index)}
            sx={{ ml: 'auto', width: 30, height: 30 }}
            children={<CloseRoundedIcon sx={{ color: '#8C8C8C' }} />}
          />
        ) : (
          <IconButton
            onClick={download}
            sx={{ ml: 'auto', width: 30, height: 30 }}
            children={
              <FontAwesomeIcon icon={faDownload} color={theme.palette.common.icon.main} size="sm" />
            }
          />
        )}
      </HorizontalWrapper>
      <ImagePreview
        url={previewUrl}
        download={download}
        open={openPreview}
        handleClose={togglePreviewDialog}
      />
    </>
  );
}

export default FileWidget;
