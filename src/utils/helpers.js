import get from 'lodash.get';
import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

export const joinArray = (array = [], splitter = ' ') => {
  if (!Array.isArray(array) || array.length < 1) return '';

  return array.filter(Boolean).join(splitter);
};

export function factoryReducer(actionType) {
  return (state, action) => {
    switch (action.type) {
      case actionType:
        return {
          ...state,
          ...action.payload
        };
      default:
        return state;
    }
  };
}

export function makeItMap(array = [], key = 'id') {
  const table = new Map();

  array.forEach((item, i) => {
    table.set(item[key], { ...item, i });
  });

  return table;
}

export function formErrorFactory(errors) {
  return (name, isArrayField = false) => {
    const message = isArrayField ? get(errors, `${name}`)?.message : get(errors, `${name}.message`);

    return {
      helperText: message,
      error: Boolean(message)
    };
  };
}

export function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
}

export function formatRichTextForApi(content) {
  return draftToHtml(convertToRaw(content.getCurrentContent()));
}

const customContentStateConverter = (contentState) => {
  // changes block type of images to 'atomic'
  const newBlockMap = contentState.getBlockMap().map((block) => {
    const entityKey = block.getEntityAt(0);
    if (entityKey !== null) {
      const entityBlock = contentState.getEntity(entityKey);
      const entityType = entityBlock.getType();
      switch (entityType) {
        case 'IMAGE': {
          const newBlock = block.merge({
            type: 'atomic',
            text: 'img'
          });
          return newBlock;
        }
        default:
          return block;
      }
    }
    return block;
  });
  const newContentState = contentState.set('blockMap', newBlockMap);
  return newContentState;
};

export function formatRichTextForUI(description) {
  const html = convertFromHTML(description);
  return EditorState.createWithContent(
    customContentStateConverter(
      ContentState.createFromBlockArray(html.contentBlocks, html.entityMap)
    )
  );
}

export function extractSpaceAndMakeLower(text = '') {
  if (!text) {
    return '';
  }

  return text.trim().toLowerCase();
}

export function search(content = '', input = '') {
  return extractSpaceAndMakeLower(content).includes(extractSpaceAndMakeLower(input));
}

export function extractObjectPart({ keys, obj, type }) {
  if (type === 'include') {
    return keys.reduce((acc, cur) => ({ ...acc, [cur]: obj[cur] }), {});
  }

  return Object.keys(obj).reduce(
    (acc, cur) => ({
      ...acc,
      ...(!keys.includes(cur) && { [cur]: obj[cur] })
    }),
    {}
  );
}

export function extractFileExtension(fileName) {
  const regex = /(?:\.([^.]+))?$/;

  return regex.exec(fileName)[0] || '';
}

export function getTicketPrimaryColor(type) {
  switch (type) {
    case 'request':
      return (theme) => theme.palette.common.request;
    case 'task_done':
      return (theme) => theme.palette.common.task_done;
    case 'bug_report':
      return (theme) => theme.palette.common.bug_report;
    case 'file_exchange':
      return (theme) => theme.palette.common.file_exchange;
    default:
      return;
  }
}

export default async function saveFile(plaintext, fileName, fileType) {
  return new Promise((resolve, reject) => {
    const dataView = new DataView(plaintext);
    const blob = new Blob([dataView], { type: fileType });

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, fileName);
      return resolve();
    } else if (/iPhone|fxios/i.test(navigator.userAgent)) {
      // This method is much slower but createObjectURL
      // is buggy on iOS
      const reader = new FileReader();
      reader.addEventListener('loadend', () => {
        if (reader.error) {
          return reject(reader.error);
        }
        if (reader.result) {
          const a = document.createElement('a');
          // @ts-ignore
          a.href = reader.result;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
        }
        resolve();
      });
      reader.readAsDataURL(blob);
    } else {
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(downloadUrl);
      setTimeout(resolve, 100);
    }
  });
}

export function validUzbPhonePattern(value) {
  const regex = /^\+998\d{9}$/;

  return regex.test(value);
}

export function formatUzbekPhoneNumber(input) {
  // Remove non-digit characters from the input
  const cleanedNumber = input.replace(/\D/g, '');

  // Check if the cleaned number has 9 digits
  if (cleanedNumber.length === 9) {
    // Reformat the number to include the '998' prefix
    const formattedNumber = '+998' + cleanedNumber;
    return formattedNumber;
  } else if (cleanedNumber.length === 12 && cleanedNumber.startsWith('998')) {
    // If the input already includes '998', consider it valid
    return '+' + cleanedNumber;
  } else {
    // Invalid number, handle accordingly (you may choose to return null or throw an error)
    return '';
  }
}

export function extractTextFromHTML(htmlString) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;

  // Extract text content from the created div
  const text = tempDiv.textContent || tempDiv.innerText || '';

  return text;
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
