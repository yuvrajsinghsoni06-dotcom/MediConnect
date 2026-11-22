export function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err);

  if (err.message === 'RELEASE_PREREQUISITES_NOT_MET') {
    return res.status(422).json({
      success: false,
      error: 'RELEASE_PREREQUISITES_NOT_MET',
      message: 'Blood unit cannot be released. Mandatory safety criteria unfulfilled.',
      blockingReasons: err.reasons || []
    });
  }

  if (err.message === 'DONATION_NOT_FOUND') {
    return res.status(404).json({
      success: false,
      error: 'DONATION_NOT_FOUND',
      message: 'Donation unit not found.'
    });
  }

  res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected server error occurred.'
  });
}
