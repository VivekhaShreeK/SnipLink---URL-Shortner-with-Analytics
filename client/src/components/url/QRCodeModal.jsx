import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';
import Modal from '../ui/Modal';

const QRCodeModal = ({ isOpen, onClose, url }) => {
  const shortUrl = url?.shortUrl || '';

  const handleDownload = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 400, 400);
      ctx.drawImage(img, 0, 0, 400, 400);

      const link = document.createElement('a');
      link.download = `qr-${url?.effectiveCode || 'code'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="QR Code" maxWidth="max-w-sm">
      <div className="flex flex-col items-center">
        <div className="bg-white p-4 rounded-xl mb-4">
          <QRCodeSVG
            id="qr-code-svg"
            value={shortUrl}
            size={200}
            level="H"
            includeMargin={false}
          />
        </div>

        <p className="text-sm text-surface-500 dark:text-surface-400 mb-4 text-center break-all">
          {shortUrl}
        </p>

        <button onClick={handleDownload} className="btn-primary w-full">
          <Download className="w-4 h-4" />
          Download PNG
        </button>
      </div>
    </Modal>
  );
};

export default QRCodeModal;
